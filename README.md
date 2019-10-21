# service-marketplace
A service/asset marketplace as 2nd layer on the tangle

## Concept / Idea
There are thousands of services, api's and assets provided in the internet. Most of them are close and only available in intern networks of enterprises. Others are behind a paywall and can only be used with a monthly subscription fee. There are also serivces avialable, where you can only pay for what you use. But these services are mostly provided in a dedicated space like a specific cloud.

We want to provide a concept, that is accessible for everyone and where you do not need to subcripe to a monthly billing plan or to rely on only one provider.
Instead we could have a decentral marketplace, where you can discover, provide and use services from different parties and pay only for what you use!
For this purpose the tangle seems to be perfect. With this package we have implemented a 2nd layer protocol on the tangle to provide the above descriped marketplace for services and assets.

Everyone can contribute in this marketplace and use the services by only paying IOTAs. IOTA provides feeless and decentralized micro-payments. So you can pay even for smaller services like a single api request. Or only on chapter of a book, one single image or any other asset that will come in your mind!

## How it works
1. To generate a new Service/Asset, you simply create a new MAM channel (mode: public). To this channel you publish the information of your service you'll provide. These information includes a title, description, the price (in IOTA), `payment informations` and also a `public key` (purpose will be explained in step 4).
2. You can update these informations simply by creating another message with the updated information into the same channel.
3. Anyone can read these informations and can decide by their own, to use your service according the information you provide.
4. If the customer decides to claim your service, he simply creates a IOTA transaction with the `job definition`, a secret `sideKey` (purpose will explained in step X), and a `unique identifier`. The IOTA transaction must be sent to the `payment informations` above and with the exact `IOTA` amount requested in the service description. Note: all content of the `job definition` expect the `unique identifier` gets encrypted with the `public key` provided by the provider.
5. The service provider tracks all incoming IOTA transactions to his `payment information`. If the IOTA amount is correct, the provider can decrypt the `job definition` with his private key.
6. The provider executes the service he provides with the received information of the `job definition`.
7. After successful execution the provider creates a new MAM message to his channel with the `execution result`. This `execution result` will be encrypted with the `sideKey` provided by the customer in the `job definition`. Only the customer will be able to decrypt this message, because only he knows the `sideKey`. Also the provider adds the unencrypted `unique identifier` to this message.
8. The customer can subscribe to new messages from the MAM channel of the provider and can therefore track for his `unique identifier`. If the customer receives a message with his `unique identifier` he can decrypt the `execution result` with his `sideKey`.

## Package
This PoC is written as a JavaScript/NodeJs package. So anyone can use this packages and implement it in their Services.