import axios from 'axios';

const API_URL = `${window.location.origin}/artists`;

export interface Artist {
    id: number;
    name: string;
    rate: number;
    streams: number;
    payoutComplete: boolean;
    payout: number;
    averageMonthlyPayout: number;
}

class ArtistService {
    async getAllArtists(): Promise<Artist[]> {
        const response = await axios.get<Artist[]>(API_URL);
        return response.data;
    }

    async getArtistById(id: number): Promise<Artist> {
        const response = await axios.get<Artist>(`${API_URL}/${id}`);
        return response.data;
    }

    async getArtistByName(name: string): Promise<Artist | null> {
        try {
            const response = await axios.get<Artist>(`${API_URL}/name/${name}`);
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                return null; // Artist not found
            }
            throw err; // Re-throw other errors
        }
    }

    async createArtist(artist: Artist): Promise<Artist> {
        const response = await axios.post<Artist>(`${API_URL}/create`, artist);
        return response.data;
    }

    async uploadArtists(artists: Artist[]): Promise<void> {
        await axios.post(`${API_URL}/upload`, artists);
    }

    async updateArtist(id: number, artist: Artist): Promise<void> {
        await axios.put(`${API_URL}/${id}`, artist);
    }

    async updatePayoutStatus(id: number, status: boolean): Promise<void> {
        await axios.put(`${API_URL}/payout/${id}/${status}`);
    }

    async deleteArtist(id: number): Promise<void> {
        await axios.delete(`${API_URL}/${id}`);
    }
}

export default new ArtistService();
