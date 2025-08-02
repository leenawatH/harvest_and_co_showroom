export const getTransformedImage = (height: number, imageUrl: string): string => {
        if (!imageUrl) return imageUrl || "";

        //return imageUrl.replace("/upload/", "/upload/c_crop,w_1220,h_1300,y_100/c_crop,g_center,w_1000,h_1000/");

        if (height <= 100) {
            return imageUrl.replace("/upload/", "/upload/c_crop,h_650,g_south,y_200/");
        } else if (height <= 120 && height > 100) {
            return imageUrl.replace("/upload/", "/upload/c_crop,h_800,g_south,y_200/");
        } else if (height <= 140 && height > 120) {
            return imageUrl.replace("/upload/", "/upload/c_crop,h_900,g_south,y_200/");
        } else if (height <= 150 && height > 140) {
            return imageUrl.replace("/upload/", "/upload/c_crop,h_1000,g_south,y_200/");
        } else if (height <= 180 && height > 150) {
            return imageUrl.replace("/upload/", "/upload/c_crop,h_1100,g_south,y_200/");
        } else if (height <= 200 && height > 180) {
            return imageUrl.replace("/upload/", "/upload/c_crop,h_1200,g_south,y_200/");
        } else if (height <= 220 && height > 200) {
            return imageUrl.replace("/upload/", "/upload/c_crop,h_1300,g_south,y_200/");
        } else if (height <= 240 && height > 220) {
            return imageUrl.replace("/upload/", "/upload/c_crop,h_1400,g_south,y_200/");
        } else {
            return imageUrl;
        }

    }