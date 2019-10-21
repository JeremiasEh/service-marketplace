import Provider from "./default.provider";

export default class IotaProvider extends Provider {

    constructor () {
        super ();
    }

    getPaymentInformation () {
        return "XXX_IOTA_ADDRESS";
    }

}