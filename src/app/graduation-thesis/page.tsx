"use client";
import React, { useEffect, useState } from 'react';
import { getTheses, deleteThesis } from '../../services/graduationThesisService';
import Link from 'next/link';
import { Paper } from '@mui/material';

const ThesisList = () => {
    const [theses, setTheses] = useState([]);
    useEffect(() => {
        fetchTheses();
    }, []);

    const fetchTheses = async () => {
        const data = await getTheses();
        setTheses(data);
    };

    const handleDelete = async (id: string) => {
        await deleteThesis(id);
        fetchTheses();
    };
    return (

        <div>
            <Paper sx={{ p: 2 }} elevation={3}>
                <h1 className="text-2xl font-bold mb-4">Graduation Theses</h1>
                <Link href="/graduation-thesis/new">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">Add New Thesis</button>
                </Link>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2">Title</th>
                            <th className="py-2">Lecturer</th>
                            <th className="py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {theses.map((thesis: any) => (
                            <tr key={thesis.id}>
                                <td className="py-2">{thesis.title}</td>
                                <td className="py-2">{thesis.lecturer?.name}</td>
                                <td className="py-2">
                                    <Link href={`/graduation-thesis/${thesis.id}`}>
                                        <button className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2">Edit</button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(thesis.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Paper>
        </div >
    );
};


export default ThesisList;