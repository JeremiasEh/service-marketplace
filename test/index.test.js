import { Service, Consumer, IotaProvider } from "../src/index";

(async () => {

    try {

        console.log ("HEY");

        // const service = await Service.createNewService ({
        //     title: "SMS-API",
        //     description: "Simply send SMS messages to your customers.",
        //     price: 500000,
        //     author: "@tangleMesh",
        // });

        // console.log ("DETAILS", service.MamRoot, service.MamSeed);

        // if (!service) {
        //     console.error ("No service initialized!");
        // }

        const service = new Service ("KEIYVDFIDRYAMDNWUPI9SSYVAONSKJRBJEMENBRHDFFSZCVYCUUOXUKUUQIAVDIFH9SGEGHNKNSFJGLL9", "XHFLFPAZISJGMGLAZ9QCZTPFHPMBOTYNVEGNEMPDQTJFQIZCVMGGOHPLQVXRK9CERMICLBLADASBSWBCO", "test");
        await service.initService ();

        // service.setParameter ("test", 2323);
        // service.setParameter ("test2", "key ho");
        // service.setParameter ("test3", 222.23);
        service.deleteParameter ("updatedServiceDetails");

        await service.updateService ();

        console.log (service.Parameters);
        return;

    } catch (e) {
        console.error ("ERROR", e);
    }

})();