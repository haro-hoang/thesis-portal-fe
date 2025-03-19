import { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    FormHelperText,
    Autocomplete,
    IconButton,
} from '@mui/material';
import { GraduationThesis } from '@/services/graduation-thesis/@/types/graduation-thesis';
import { Teacher } from '@/services/teachers/@/types/teacher';
import { Student } from '@/services/students/@/types/student';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { searchStudents } from '@/services/students/studentService';
import StarterKit from "@tiptap/starter-kit";
import {
    MenuButtonBold,
    MenuButtonItalic,
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    RichTextEditor,
    type RichTextEditorRef,
} from "mui-tiptap";


interface DialogGraduationThesisProps {
    open: boolean;
    mode: 'add' | 'edit';
    thesis?: GraduationThesis | null;
    teachers: Teacher[];
    onClose: () => void;
    onSubmit: (formData: any) => Promise<void>;
}

interface FormData {
    title: string;
    description: string;
    lecturerId: string;
    studentIds: string[];
}

export default function DialogGraduationThesis({
    open,
    mode,
    thesis,
    teachers,
    onClose,
    onSubmit
}: DialogGraduationThesisProps) {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        lecturerId: '',
        studentIds: ['']
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [studentOptions, setStudentOptions] = useState<Student[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

    const handleStudentSearch = async (searchText: string) => {
        if (!searchText || searchText.length < 2) {
            setStudentOptions([]);
            return;
        };

        setSearchLoading(true);
        try {
            const results = await searchStudents(searchText);
            setStudentOptions(results);
        } catch (error) {
            console.error('Error searching students:', error);
            setStudentOptions([]);
        } finally {
            setSearchLoading(false);
        }
    };

    useEffect(() => {
        if (thesis && mode === 'edit') {
            setFormData({
                title: thesis.title,
                description: thesis.description || '',
                lecturerId: thesis.lecturerId,
                studentIds: thesis.students?.map(s => s.studentId) || ['']
            });
            const listStudent = thesis.students?.map(s => s.student) || [];
            setSelectedStudents(listStudent || []);
        } else {
            setFormData({
                title: '',
                description: '',
                lecturerId: '',
                studentIds: ['']
            });
            setSelectedStudents([]);
        }
    }, [thesis, mode, open]);

    const handleAddStudent = () => {
        setFormData(prev => ({
            ...prev,
            studentIds: [...prev.studentIds, '']
        }));
    };

    const handleRemoveStudent = (index: number) => {
        setFormData(prev => ({
            ...prev,
            studentIds: prev.studentIds.filter((_, i) => i !== index)
        }));
        setSelectedStudents(prev => prev.filter((_, i) => i !== index));
        setStudentOptions([]);
    };

    const handleStudentChange = (index: number, newValue: Student | null) => {
        if (newValue) {
            setSelectedStudents(prev => {
                const newStudents = [...prev];
                newStudents[index] = newValue;
                return newStudents;
            });
            setFormData(prev => ({
                ...prev,
                studentIds: prev.studentIds.map((id, i) =>
                    i === index ? newValue.id : id
                )
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.lecturerId) newErrors.lecturerId = 'Lecturer is required';
        if (formData.studentIds.some(id => !id)) {
            newErrors.students = 'All student fields must be filled';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        await onSubmit(formData);
    };

    const handleClose = () => {
        setStudentOptions([]);
        setSelectedStudents([]);
        setFormData({
            title: '',
            description: '',
            lecturerId: '',
            studentIds: ['']
        });
        setErrors({});
        onClose();
    };

    // Rich text editor handle
    const rteRef = useRef<RichTextEditorRef>(null);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                {mode === 'add' ? 'Add New Thesis' : 'Edit Thesis'}
            </DialogTitle>
            <DialogContent>
                <div className="mt-4 space-y-4">
                    <FormControl fullWidth error={!!errors.title}>
                        <TextField
                            required
                            label="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            error={!!errors.title}
                            helperText={errors.title}
                            fullWidth
                            margin="normal"
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            multiline
                            rows={4}
                            fullWidth
                            margin="normal"
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <RichTextEditor
                            ref={rteRef}
                            extensions={[StarterKit]}
                            content={thesis?.objectives || ''}
                            renderControls={() => (
                                <MenuControlsContainer>
                                    <MenuSelectHeading />
                                    <MenuDivider />
                                    <MenuButtonBold />
                                    <MenuButtonItalic />
                                    {/* Add more controls of your choosing here */}
                                </MenuControlsContainer>
                            )}
                        />
                    </FormControl>

                    <FormControl fullWidth error={!!errors.lecturerId}>
                        <Autocomplete
                            sx={{ marginTop: '10px' }}
                            options={teachers}
                            getOptionLabel={(option) => option.fullName}
                            value={teachers.find(t => t.id === formData.lecturerId) || null}
                            onChange={(_event, newValue) => {
                                setFormData({ ...formData, lecturerId: newValue?.id || '' });
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Lecturer"
                                    error={!!errors.lecturerId}
                                />
                            )}
                        />
                        {errors.lecturerId && (
                            <FormHelperText>{errors.lecturerId}</FormHelperText>
                        )}
                    </FormControl>



                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium">Students</h3>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={handleAddStudent}
                                disabled={formData.studentIds.length >= 5} // Limit to 5 students
                            >
                                Add Student
                            </Button>
                        </div>
                        {formData.studentIds.map((studentId, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <FormControl fullWidth>
                                    <Autocomplete
                                        options={studentOptions}
                                        getOptionLabel={(option) =>
                                            `${option.fullName} - ${option.email} - ${option.programName}`
                                        }
                                        value={selectedStudents[index] || null}
                                        onChange={(_event, newValue) => {
                                            handleStudentChange(index, newValue);
                                        }}
                                        onInputChange={(_event, newInputValue) => {
                                            handleStudentSearch(newInputValue);
                                        }}
                                        loading={searchLoading}
                                        filterOptions={(x) => x} // Disable client-side filtering
                                        noOptionsText="Type to search students..."
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={`Student ${index + 1}`}
                                                error={!!errors.students}
                                                required
                                                margin='normal'
                                            />
                                        )}
                                    />
                                </FormControl>
                                {index > 0 && (
                                    <IconButton
                                        onClick={() => handleRemoveStudent(index)}
                                        color="error"
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                )}
                            </div>
                        ))}
                        {errors.students && (
                            <FormHelperText error>{errors.students}</FormHelperText>
                        )}

                    </div>
                </div>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                >
                    {mode === 'add' ? 'Create' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}