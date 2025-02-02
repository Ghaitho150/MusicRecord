import React, { useState } from 'react';
import ArtistService, { Artist } from '../services/ArtistService';


interface ArtistCreateProps {
    onCreate: () => void;
    onCancel: () => void;
}

const ArtistCreate: React.FC<ArtistCreateProps> = ({ onCreate, onCancel }) => {
    const [artist, setArtist] = useState<Artist>({
        id: 0,
        name: '',
        rate: 0,
        streams: 0,
        payout: 0,
        averageMonthlyPayout: 0,
        payoutComplete: false
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setArtist({
            ...artist,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const existingArtist = await ArtistService.getArtistByName(artist.name);
            if (existingArtist) {
                setError('Artist with this name already exists.');
                return;
            }
        } catch (err) {
            setError('Failed to check artist: ' + err);
            return;
        }

        try {
            await ArtistService.createArtist(artist);
            onCreate();
        } catch (err) {
            setError('Failed to create artist: ' + err);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Create New Artist</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-white-700">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={artist.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white-700">Rate:</label>
                    <input
                        type="number"
                        name="rate"
                        value={artist.rate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white-700">Streams:</label>
                    <input
                        type="number"
                        name="streams"
                        value={artist.streams}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>
                
                <div className="flex justify-between">
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Create</button>
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded-md">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default ArtistCreate;
