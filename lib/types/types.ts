import exp from "constants";

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
    is_suggested: number;
}
export interface SinglePotInCard {
    id: string;
    name: string;
    height: number;
    price: number;
    circumference: number;
    url?: string;
    is_suggested: number;
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

export interface SinglePortInCard{
    id: string;
    title: string;
    location: string;
    image_cover: string;
    is_suggested: number;
}

export interface Port {
    id: string;
    title: string;
    location: string;
    image_cover: string;
    description: string;
    is_suggested: number;
    similar_port?: string[];
    port_bottom_groups: Port_Bottom_Groups[];
    port_middle_sections: Port_Middle_Sections[];
    file: File | null;
}

export interface Port_Middle_Sections {
    id: string;
    port_id: string;
    title: string;
    detail: string;
    image_url: string;
    position: number;
    file: File | null;
}

export interface Port_Bottom_Groups {
    id: string;
    pattern: 1 | 2 | 3; // 1: pattern1, 2: pattern2, 3: pattern3
    port_id: string;
    image_url_1 : string;
    image_url_2 : string;
    image_url_3 : string;
    file1: File | null;
    file2: File | null;
    file3: File | null;
}

