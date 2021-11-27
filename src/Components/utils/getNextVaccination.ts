import { PetsVaccination } from "../../models/Vaccination";
export default function (vaccinations: PetsVaccination[]) {
    let nextVaccination: any;
    let nowDate = new Date();
    let dates = vaccinations.map(x => x.dates).join(",").split(",");
    dates.forEach((vacination: any) => {
        let vacinationDate = new Date(String(vacination));
        if (!nextVaccination) {
            nextVaccination = vacinationDate;
        } else if (vacinationDate < nextVaccination && vacinationDate > nowDate) {
            nextVaccination = vacinationDate;
        }
    });
    return nextVaccination;
}