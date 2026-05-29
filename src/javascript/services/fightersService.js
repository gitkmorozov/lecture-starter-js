import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    #detailsEndpoint = 'details/fighter';

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    async getFighterDetails(id) {
        try {
            const endpoint = `${this.#detailsEndpoint}/${id}.json`;
            const apiResult = await callApi(endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }
}

const fighterService = new FighterService();

export default fighterService;
