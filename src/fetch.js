import axios from 'axios';
import { getId } from './utils';
import { PILOTS_URL, PLANETS_URL } from './urls';

export const fetchVehicles = async (url) => {
    const vehiclesData = [];
    let fetchUrl = url;
    while (fetchUrl) {
        const res = await axios.get(fetchUrl)
        const newVehicles = res.data.results.map(vehicle => (
            {
                name: vehicle.name,
                pilotIds: vehicle.pilots.map(pilotUrl => getId(pilotUrl))
            }
        ))
        vehiclesData.push(...newVehicles)
        fetchUrl = res.data.next;
    }
    return vehiclesData;
}

export const fetchPilot = async (pilotId) => {
    const res = await axios.get(`${PILOTS_URL}${pilotId}/`)
    const newPilot = {}
    newPilot[pilotId] = {
        pilotName: res.data.name,
        homePlanet: getId(res.data.homeworld)
    }
    return newPilot;
}

const fetchPlanet = async (planetId) => {
    const res = await axios.get(`${PLANETS_URL}${planetId}/`)
    const newPlanet = {}
    newPlanet[planetId] = {
        planetName: res.data.name,
        population: res.data.population
    }
    return newPlanet;
}

// Function for fetching planets data for both parts in a efficient way (Fetch only the planets needed for both parts)
// Another way to solve this is through fetching planets for part 1 by ID like 'fetchPilot' and for part 2 separately. 
export const fetchPlanets = async (planetsNames, planetsIds) => {
    let planetData = {};
    const tempPlanetsNames = new Set(planetsNames);
    const tempPlanetsIds = new Set(planetsIds);
    let fetchUrl = PLANETS_URL;
    while (fetchUrl && tempPlanetsNames.size) {
        const res = await axios.get(fetchUrl)
        res.data.results.forEach(planet => {
            if (tempPlanetsNames.has(planet.name) || tempPlanetsIds.has(getId(planet.url))) {
                tempPlanetsNames.delete(planet.name)
                tempPlanetsIds.delete(getId(planet.url))
                planetData = {
                    ...planetData,
                    [getId(planet.url)]:
                    {
                        planetName: planet.name,
                        population: planet.population
                    }
                }
            }
        })
        fetchUrl = res.data.next;
    }
    if (tempPlanetsIds.size) {
        const res = await Promise.all(Array.from(tempPlanetsIds).map(planetId => fetchPlanet(planetId)))
        res.map(planet => planetData = {...planetData, ...planet})
    }
    return planetData;
}

