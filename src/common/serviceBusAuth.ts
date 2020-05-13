import CryptoJS from "crypto-js";
import { URL } from "url";

export interface IServiceBusAuthHeader {
    sasToken: string;
    endpoint: string;
}

export default class ServiceBusAuth {
    
    public endpoint: string;
    public sharedAccessKeyName: string;
    public sharedAccessKey: string;
    public hostName: string;

    constructor(private connectionString: string) {
        const values: Map<string, string> = this.connectionString.split(';')
            .map(x => x.split('='))
            .reduce(function (a, b) {
                return a.set(b[0], b[1]);
            }, new Map<string, string>());

        const endPoint = values.get('Endpoint');
        const sharedAccessKeyName = values.get('SharedAccessKeyName');
        const sharedAccessKey = values.get('SharedAccessKey');

        if (!endPoint) {
            throw new Error("Endpoint undefined.");
        }

        if (!sharedAccessKeyName) {
            throw new Error("Shared Access Key Name undefined.");
        }

        if (!sharedAccessKey) {
            throw new Error("Shared Access Key undefined.");
        }
        
        this.endpoint = endPoint;
        this.sharedAccessKeyName = sharedAccessKeyName;
        this.sharedAccessKey = sharedAccessKey + '=';

        const loc = new URL(this.endpoint);
        this.hostName = loc.hostname.split(".", 1)[0];
    }

    public getAuthHeader(): IServiceBusAuthHeader {
        const d = new Date();
        const sinceEpoch = Math.round(d.getTime() / 1000);
        const expiry = (sinceEpoch + 3600);
        const stringToSign = encodeURIComponent(this.endpoint) + '\n' + expiry;
        const hash = CryptoJS.HmacSHA256(stringToSign, this.sharedAccessKey);
        const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
        
        const euc = encodeURIComponent;
        const sasToken = `SharedAccessSignature sr=${euc(this.endpoint)}&sig=${euc(hashInBase64)}&se=${expiry}&skn=${this.sharedAccessKeyName}`;
        
        return { sasToken, endpoint: this.endpoint };
    }
}