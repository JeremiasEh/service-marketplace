import Mam from "@iota/mam/lib/mam.client";
import { asciiToTrytes, trytesToAscii } from '@iota/converter';

export default class Service {
 
    constructor (
        seed = null,
        rootMam = "",
        privateKey = "",
        iriNode = "https://node-iota.org:14267",
    ) {
        this._seed = seed;
        this._mamMode = "public";
        this._iriNode = iriNode;
        this._mamRoot = rootMam;
        this._privateKey = privateKey;
        this._parameters = {};
        this._updatedParameters = [];
        this._deletedParameters = [];
        if (this._seed) {
            this._mamState = Mam.init (this._iriNode, this._seed);
        } else {
            this._mamState = Mam.init (this._iriNode);
            this._seed = this._mamState.seed;
        }
        this._mamState = Mam.changeMode (this._mamState, this._mamMode);
    }

    async initService () {
        try {
            //Read the config history and set the details accordingly
            const result = await Mam.fetch(this._mamRoot, this._mamMode, null);
            for (const message of result.messages) {
                try {
                    const parsedMessage = JSON.parse(trytesToAscii(message));
                    for (const key in parsedMessage) {
                        if (parsedMessage [key] === "{{remove}}") {
                            this.deleteParameter (key);
                        } else {
                            this.setParameter (key, parsedMessage [key]);
                        }
                    }
                } catch (e) {}
            }
            this._mamState.channel.next_root = result.nextRoot;
            this._mamState.channel.start = result.messages.length;
            this._updatedParameters = [];

            return true;
        } catch (e) {
            console.error (e);
            return false;
        }
    }

    async _publishService () {
        try {
            const trytes = asciiToTrytes (JSON.stringify({
                "type": "service-marketplace",
                ...this.Parameters,
            }));
            const message = Mam.create (this._mamState, trytes);
            this._mamState = message.state;
            this._mamRoot = message.root;

            await Mam.attach(message.payload, message.address, 3, 14);
        
            return true;
        } catch (e) {
            console.error (e);
            return false;
        }
    }

    async updateService () {
        try {
            let updatedServiceDetails = {};
            for (const key of this._updatedParameters) {
                updatedServiceDetails [key] = this.getParameter (key);
            }
            for (const key of this._deletedParameters) {
                updatedServiceDetails [key] = "{{remove}}"
            }
            if (Object.keys (updatedServiceDetails).length <= 0) {
                return true; //No update, because already up to date!
            }

            const trytes = asciiToTrytes (JSON.stringify(updatedServiceDetails));
            const message = Mam.create (this._mamState, trytes);
            this._mamState = message.state;

            await Mam.attach(message.payload, message.address, 3, 14);
        
            return true;
        } catch (e) {
            console.error (e);
            return false;
        }
    }

    //Factory method to create new Service
    static async createNewService (config = {
        iriNode: "https://node-iota.org:14267",
        title: "unkown",
        description: "unknown",
        price: 0,
        author: "unknown",
    }) {
        //TODO:
        const privateKey = "";

        //Create new Service object
        const service = new Service (
            null, //Will be created by `constructor ()`
            null, //Will be created by `async _publishService ()`
            privateKey,
            config.iriNode,
        );

        //Add all custom parameters to the new Service
        delete config.iriNode;
        for (const key in config) {
            service.setParameter (key, config [key]);
        }

        //Publish new Service to the network
        if (!(await service._publishService ())) {
            return null;
        }
        this._updatedParameters = [];

        return service;
    }

    set Provider (provider) {
        this.provider = provider;
    }

    get Provider () {
        return this.provider;
    }

    setParameter (key, content) {
        if (
            typeof key !== "string" && typeof key !== "number" &&
            typeof content !== "string" && typeof content !== "number"
        ) {
            return false;
        }
        this._updatedParameters.push (key);
        this._parameters [key] = content;
        return true;
    }

    getParameter (key) {
        return this.Parameters [key];
    }

    deleteParameter (key) {
        this._deletedParameters.push (key);
        delete this._parameters [key];
    }

    get Parameters () {
        return this._parameters;
    }

    get MamRoot () {
        return this._mamRoot;
    }

    get MamSeed () {
        return this._seed;
    }

}