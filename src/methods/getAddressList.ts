const API_KEY = 'beaf63bec753f566ae87b3146e274cdd8f34419a'
const URL_PATH = 'http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
const LOCATION = 'КАЗАНЬ'

export interface ListItem extends Object {
    value: string
}

export async function getAddressList(query: string): Promise<ListItem[]> {
    const res = await fetch(URL_PATH, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Token ' + API_KEY,
        },
        body: JSON.stringify({
            query: query,
            locations: [
                {
                    city: LOCATION,
                },
            ],
            restrict_value: true,
        }),
    })

    return await res.json().then((data) => data.suggestions)
}
