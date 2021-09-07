export const getId = (url) => {
    const temp = url.slice(0, url.length - 1)
    const lastIndex = temp.lastIndexOf('/')
    return temp.slice(lastIndex + 1)
}

export const uniquePilots = (vehicles) => {
    const uniquePilotsIds = new Set();
    vehicles.forEach(vehicle => {
        vehicle.pilotIds.forEach(pilotId => {
            uniquePilotsIds.add(pilotId);
        })
    })
    return uniquePilotsIds;
}

export const extractHomePlanetId = (pilot) => Object.values(pilot)[0].homePlanet;



