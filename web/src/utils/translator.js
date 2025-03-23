export const translator = {
    endpoint: 'http://127.0.0.1:5000/translate',

    isAvailable: async function() {
        // check if the endpoint is available
        try {       
            const rsp = await fetch(this.endpoint);
            return rsp.ok;
        } catch (e) {
            return false;
        }
    },

    translate: async function(text, target='zh') {
        const rsp = await fetch(
            this.endpoint,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: text,
                    source: 'en',
                    target: target,
                    format: 'html'
                })
            }
        );

        const data = await rsp.json();

        return data;
    }
}