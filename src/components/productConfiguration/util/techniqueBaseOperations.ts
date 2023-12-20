import {qtyProxy} from "../../../../index";

const singleColorPositionTechnique = ["Laser Engraving","Gold Foil Debossing","Silver Foil Debossing", "Blind Debossing"];
const gradientColorPositionTechnique = ["Screen Printing", "Embroidery"];
export function CheckTechniqueSingleColor(): boolean {
    return singleColorPositionTechnique.includes(qtyProxy?.selectedTechnique?.techniqueName);
}

export function CheckTechniqueGradientSupport(): boolean {
    console.log("tech", qtyProxy?.selectedTechnique?.techniqueName)
    return gradientColorPositionTechnique.includes(qtyProxy?.selectedTechnique?.techniqueName);
}

export function TechniqueBaseSingleColor(): number[] {
    switch(qtyProxy?.selectedTechnique?.techniqueName) {
        case "Laser Engraving":
            return [192,192,192];
        case "Gold Foil Debossing":
            return [255,215,0];
        case "Silver Foil Debossing":
            return [190,190,190];
        case "Blind Debossing":
            return [185,185,185];
        default:
            return [0,0,0];
    }
}
