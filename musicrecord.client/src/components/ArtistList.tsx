import React, { useEffect, useState } from 'react';
import ArtistService, { Artist } from '../services/ArtistService';
import ArtistUpdate from './ArtistUpdate';
import ArtistCreate from './ArtistCreate';

const ArtistList: React.FC = () => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingArtistId, setUpdatingArtistId] = useState<number | null>(null);
    const [creating, setCreating] = useState<boolean>(false);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const data = await ArtistService.getAllArtists();
                if (Array.isArray(data)) {
                    setArtists(data);
                } else {
                    setError('Unexpected data format');
                }
            } catch (err) {
                setError('Failed to fetch artists: ' + err);
            } finally {
                setLoading(false);
            }
        };

        fetchArtists();
    }, []);

    // Handle artist deletion
    const handleDelete = async (id: number) => {
        try {
            await ArtistService.deleteArtist(id);
            setArtists(artists.filter(artist => artist.id !== id));
        } catch (err) {
            setError('Failed to delete artist: ' + err);
        }
    };
    // Handle artist update initiation
    const handleUpdate = (id: number) => {
        setUpdatingArtistId(id);
    };

    // Handle artist creation initiation
    const handleCreate = () => {
        setCreating(true);
    };

    // Handle completion of artist update
    const handleUpdateComplete = () => {
        setUpdatingArtistId(null);
        fetchArtists();
    };

    // Handle completion of artist creation
    const handleCreateComplete = () => {
        setCreating(false);
        fetchArtists();
    };

    // Fetch all artists (used after create/update operations)
    const fetchArtists = async () => {
        try {
            const data = await ArtistService.getAllArtists();
            if (Array.isArray(data)) {
                setArtists(data);
            } else {
                setError('Unexpected data format');
            }
        } catch (err) {
            setError('Failed to fetch artists: ' + err);
        }
    };

    // Handle payout status change
    const handlePayoutStatusChange = async (id: number, status: boolean) => {
        try {
            console.log(status); // Debugging line
            await ArtistService.updatePayoutStatus(id, status);
            setArtists(prevArtists =>
                prevArtists.map(artist =>
                    artist.id === id ? { ...artist, payoutComplete: status } : artist
                )
            );
        } catch (err) {
            setError('Failed to update payout status: ' + err);
        }
    };

    // Show loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Show error message if any
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Music Record</h1>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={handleCreate}>Create New Artist</button>
            {creating ? (
                <ArtistCreate
                    onCreate={handleCreateComplete}
                    onCancel={() => setCreating(false)}
                />
            ) : updatingArtistId ? (
                <ArtistUpdate
                    artistId={updatingArtistId}
                    onUpdate={handleUpdateComplete}
                    onCancel={() => setUpdatingArtistId(null)}
                />
            ) : (
                        <table className="min-w-full mx-auto">
                    <thead>
                        <tr>
                            <th className="py-2">Name</th>
                            <th className="py-2">Rate</th>
                            <th className="py-2">Streams</th>
                            <th className="py-2">Payout</th>
                            <th className="py-2">Avg. Monthly Payout</th>
                            <th className="py-2">Paid</th>
                            <th className="py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(artists) && artists.map(artist => (
                            <tr key={artist.id}>
                                <td className="border px-4 py-2">{artist.artist}</td>
                                <td className="border px-4 py-2">{artist.rate}</td>
                                <td className="border px-4 py-2">{artist.streams}</td>
                                <td className="border px-4 py-2">{artist.payout}</td>
                                <td className="border px-4 py-2">{artist.averageMonthlyPayout.toFixed(2)}</td>
                                <td className="border px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={artist.payoutComplete}
                                        onChange={(e) => {
                                            console.log(e.target.checked); // Debugging line
                                            handlePayoutStatusChange(artist.id, e.target.checked)
                                        }}
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleUpdate(artist.id)}>Update</button>
                                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(artist.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ArtistList;
