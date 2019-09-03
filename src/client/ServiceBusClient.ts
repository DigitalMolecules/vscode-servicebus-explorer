import * as CryptoJS from 'crypto-js';
import fetch from 'node-fetch';

export default class ServiceBusClient implements IServiceBusClient {

    constructor(private connectionString: string){

    }

    public async validateAndThrow() : Promise<void> {

        const values: Map<string, string> = this.connectionString.split(';')
                .map(x=> x.split('='))
                // .reduce(x=> {x[0]: x[1]}, [])
                 .reduce(function(a, b){
                    return a.set(b[0], b[1]);
                 }, new Map<string, string>())
                ;
                
        const Endpoint = values.get('Endpoint') ;
        const SharedAccessKeyName = values.get('SharedAccessKeyName');
        const SharedAccessKey = values.get('SharedAccessKey') + '=';

        if(!Endpoint || !SharedAccessKeyName || !SharedAccessKey){
            throw new Error("Invalid connection string");
        }

        var auth = getAuthHeader(Endpoint, SharedAccessKeyName, SharedAccessKey)
        var result = await fetch(Endpoint.replace('sb', 'https'), {
            method: 'POST',
            headers: { 'Authorization': auth },
        });
        var body = await result.text();
        
    }

    public getTopics(): [] {
        return [];
    }
} 

function getAuthHeader(resourceUri: string, keyName: string, key: string) {

    var d = new Date();
    var sinceEpoch = Math.round(d.getTime() / 1000);

    var expiry = (sinceEpoch + 3600);

    var stringToSign = encodeURIComponent(resourceUri) + '\n' + expiry;

    var hash = CryptoJS.HmacSHA256(stringToSign, key);
    var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

    var sasToken = 'SharedAccessSignature sr=' + encodeURIComponent(resourceUri) + '&sig=' + encodeURIComponent(hashInBase64) + '&se=' + expiry + '&skn=' + keyName;

    return sasToken;
}

//postman.setEnvironmentVariable('azure-authorization', getAuthHeader(request['url'], "RootManageSharedAccessKey", "fmmVl6GYSXS23qMfkCpUqp6GeWDNy3czEEA0UhjeI+A="));
//postman.setEnvironmentVariable('current-date',new Date().toUTCString());