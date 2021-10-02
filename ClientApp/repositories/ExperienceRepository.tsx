import * as Models from '../Models'
import { Fetch } from './Fetch'
export const ExperienceRepository = {
    CreateExperience: async (model: Models.IExperience) => {
        return Fetch.Post('/Experiences', model).then(response => {
            return response;
        })
    },
    GetExperiencesByPersonId: async (personId: string) => {
        return Fetch.Get(`/Experiences/${personId}`).then(response => {
            return response;
        })
    },
    GetExperiencesLevel: async () => {
        return Fetch.Get(`/Experiences/simples`).then(response => {
            return response;
        })
    },
}
