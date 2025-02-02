import React, { useState, useEffect } from 'react';
import ArtistService, { Artist } from '../services/ArtistService';

interface ArtistUpdateProps {
    artistId: number;
    onUpdate: () => void;
    onCancel: () => void;
}

const ArtistUpdate: React.FC<ArtistUpdateProps> = ({ artistId, onUpdate, onCancel }) => {
    const [artist, setArtist] = useState<Artist | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const data = await ArtistService.getArtistById(artistId);
                setArtist(data);
            } catch (err) {
                setError('Failed to fetch artist: ' + err);
            } finally {
                setLoading(false);
            }
        };

        fetchArtist();
    }, [artistId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (artist) {
            setArtist({
                ...artist,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (artist) {
            try {
                await ArtistService.updateArtist(artistId, artist);
                onUpdate();
            } catch (err) {
                setError('Failed to update artist: ' + err);
            }
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-md mx-auto p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Update Artist</h2>
            {artist && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-white-700">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={artist.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white-700">Rate:</label>
                        <input
                            type="number"
                            name="rate"
                            value={artist.rate}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white-700">Streams:</label>
                        <input
                            type="number"
                            name="streams"
                            value={artist.streams}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                            Update
                        </button>
                        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ArtistUpdate;
