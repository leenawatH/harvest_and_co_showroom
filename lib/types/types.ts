export enum Color {
  Black = 'black',
  White = 'white',
  Beige = 'beige',
  Stone = 'stone',
}

//ใช้ในหน้า detail ที่จะใส่ทุกอย่างไว้ในนี้
export interface Plant {
    id: string; 
    name: string;
    height: number;
    price: number;
    is_suggested: number;
    similar_plant: string[];
    addition_img: string[];
    plant_pot_options: plant_pot_options[];
}

export interface SinglePlantWithPotInCard {
    id: string;
    name: string;
    height: number;
    price: number;
    url?: string;
}
export interface SinglePotInCard {
    id: string;
    name: string;
    height: number;
    price: number;
    circumference: number;
    url?: string;
}
export interface Pot {
    id: string;
    name: string;
    height: number;
    circumference: number;
    price?: number;
    onShow_color: Color | "";
    addition_img?: string[];
    similar_pot?: string[];
    is_suggested: boolean;
    pot_colors?: Pot_Img[]; 
}

export interface plant_pot_options {
    id: string;
    plant_id: string;
    pot_id: string;
    pot_color: Color | "";
    height_with_pot?: string;
    is_suggested: boolean;
    url: string;
    file: File | null; 
}

export interface Pot_Img {
    id: string;
    pot_id: string;
    pot_color: Color | null;
    url: string;   
    file: File | null;      
}
