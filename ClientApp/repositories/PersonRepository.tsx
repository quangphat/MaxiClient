import * as Models from '../Models'
import { Fetch } from './Fetch'
export const PersonRepository = {
    GetByProfileName: async (profileName: string) => {
        return Fetch.Get(`/person/${profileName}`).then(response => {
            return response;
        })
    },
    GetPersonSkills: async (personId: string) => {
        return Fetch.Get(`/person/skills/${personId}`).then(response => {
            return response;
        })
    },
    UpdateSkill: async (skills: Models.StringModel) => {
        return Fetch.PUT(`/person/skills`, skills).then(response => {
            return response;
        })
    },
}
