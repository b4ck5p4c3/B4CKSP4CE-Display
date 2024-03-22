import apiConfig, {fetchRequest} from "./apiConfig";

const DisplayAPI = {
    state: async () => {
        return await fetchRequest(apiConfig.display.state(), 'GET');
    }
}
export default DisplayAPI;