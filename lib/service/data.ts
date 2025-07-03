export enum PotColor {
  Black = 'black',
  White = 'white',
  Beige = 'beige',
  Stone = 'stone',
}

export interface Plant {
    id: string; 
    name: string;
    height?: number;
    price?: number;
    is_Suggested: boolean;
    similar_plant_ids: string[];
}

export interface Pot {
    id: string;
    name: string;
    height: number;
    circumference: number;
    price?: number;
    is_Suggested: boolean;
}

export interface plant_pot_options {
    id: string;
    plant_id: string;
    pot_id: string;
    pot_color: PotColor;
    height_with_pot?: string;
    is_Suggested: boolean;
    url: string;
}

export interface Pot_Img {
    id: string;
    pot_id: string;
    pot_color: PotColor;
    url: string;        
}
