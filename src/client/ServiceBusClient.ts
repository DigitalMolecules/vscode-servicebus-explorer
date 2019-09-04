import * as CryptoJS from 'crypto-js';
import fetch from 'node-fetch';
import parser from 'fast-xml-parser';
import { IServiceBusClient } from './IServiceBusClient';

export default class ServiceBusClient implements IServiceBusClient {

    constructor(private connectionString: string) {
    }

    public async validateAndThrow(): Promise<void> {
        var auth = this.getAuthHeader();

        var result = await fetch(auth.endpoint.replace('sb', 'https'), {
            method: 'GET',
            headers: { 'Authorization': auth.auth },
        });

        var body = await result.text();

    }

    public async getTopics(): Promise<[any]> {
        var auth = this.getAuthHeader();
        var result = await fetch(auth.endpoint.replace('sb', 'https') + '', {
            method: 'GET',
            headers: { 'Authorization': auth.auth },
        });

        if (result.status === 404) {
            return Promise.reject();
        }

        var body = await result.text();
        var xmlData = parser.parse(body);
        var topics = xmlData.feed.entry;

        if (!Array.isArray(topics)) {
            topics = [topics];
        }

        return Promise.resolve(topics);
    }


    public getAuthHeader(): any {

        const values: Map<string, string> = this.connectionString.split(';')
            .map(x => x.split('='))
            // .reduce(x=> {x[0]: x[1]}, [])
            .reduce(function (a, b) {
                return a.set(b[0], b[1]);
            }, new Map<string, string>())
            ;


        const Endpoint = values.get('Endpoint');
        const SharedAccessKeyName = values.get('SharedAccessKeyName');
        const SharedAccessKey = values.get('SharedAccessKey') + '=';

        if (!Endpoint || !SharedAccessKeyName || !SharedAccessKey) {
            throw new Error("Invalid connection string");
        }

        var d = new Date();
        var sinceEpoch = Math.round(d.getTime() / 1000);

        var expiry = (sinceEpoch + 3600);

        var stringToSign = encodeURIComponent(Endpoint) + '\n' + expiry;

        var hash = CryptoJS.HmacSHA256(stringToSign, SharedAccessKey);
        var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

        var sasToken = 'SharedAccessSignature sr=' + encodeURIComponent(Endpoint) + '&sig=' + encodeURIComponent(hashInBase64) + '&se=' + expiry + '&skn=' + SharedAccessKeyName;

        return { auth: sasToken, endpoint: Endpoint };
    }

}




//postman.setEnvironmentVariable('azure-authorization', getAuthHeader(request['url'], "RootManageSharedAccessKey", "fmmVl6GYSXS23qMfkCpUqp6GeWDNy3czEEA0UhjeI+A="));
//postman.setEnvironmentVariable('current-date',new Date().toUTCString());