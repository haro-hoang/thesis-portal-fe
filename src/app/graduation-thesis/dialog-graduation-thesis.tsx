import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
    Paper,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { GraduationThesis } from '@/services/graduation-thesis/@/types/graduation-thesis';
import { Teacher } from '@/services/teachers/@/types/teacher';
import { Student } from '@/services/students/@/types/student';
import { Add as AddIcon, Remove as RemoveIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, Close as CloseIcon } from '@mui/icons-material';
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

// Thêm style cho RichTextEditor
const editorStyle = `
.ProseMirror {
    min-height: 150px;
}
`;

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
    objectives: string;
    expectedResults: string;
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    assignedDate: Dayjs | null;
}

export default function DialogGraduationThesis({
    open,
    mode,
    thesis,
    teachers,
    onClose,
    onSubmit
}: DialogGraduationThesisProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        lecturerId: '',
        studentIds: [''],
        objectives: '',
        expectedResults: '',
        startDate: null,
        endDate: null,
        assignedDate: null
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [studentOptions, setStudentOptions] = useState<Student[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
    const [isStudentsExpanded, setIsStudentsExpanded] = useState(true);
    const [isGeneralExpanded, setIsGeneralExpanded] = useState(true);

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
                studentIds: thesis.students?.map(s => s.studentId) || [''],
                objectives: thesis.objectives || '',
                expectedResults: thesis.expectedResults || '',
                startDate: thesis.startDate ? dayjs(thesis.startDate) : null,
                endDate: thesis.endDate ? dayjs(thesis.endDate) : null,
                assignedDate: thesis.assignedDate ? dayjs(thesis.assignedDate) : null
            });
            const listStudent = thesis.students?.map(s => s.student) || [];
            setSelectedStudents(listStudent || []);
        } else {
            setFormData({
                title: '',
                description: '',
                lecturerId: '',
                studentIds: [''],
                objectives: '',
                expectedResults: '',
                startDate: null,
                endDate: null,
                assignedDate: null
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
        if (!formData.title.trim()) newErrors.title = t('graduationThesis.titleIsRequired');
        if (!formData.lecturerId) newErrors.lecturerId = t('graduationThesis.lecturerIsRequired');
        if (formData.studentIds.some(id => !id)) {
            newErrors.students = t('graduationThesis.allStudentsMustBeFilled');
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
            studentIds: [''],
            objectives: '',
            expectedResults: '',
            startDate: null,
            endDate: null,
            assignedDate: null
        });
        setErrors({});
        onClose();
    };

    // Rich text editor handle
    const editor = useRef<RichTextEditorRef>(null);

    return (
        <>
            <style>{editorStyle}</style>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle 
                        sx={{ 
                            bgcolor: '#1976d2',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 0
                        }}
                    >
                        <div className="flex items-center justify-between w-full">
                            <span>{mode === 'add' ? t('graduationThesis.addNewThesis') : t('graduationThesis.editThesis')}</span>
                            <IconButton
                                edge="end"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                                size="small"
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div className="mt-4 space-y-4">
                            <Paper 
                                sx={{ 
                                    bgcolor: '#e3f2fd',
                                    mb: 1
                                }}
                            >
                                <div className="flex justify-between items-center p-2">
                                    <div className="flex items-center gap-2">
                                        <IconButton
                                            onClick={() => setIsGeneralExpanded(!isGeneralExpanded)}
                                            size="small"
                                        >
                                            {isGeneralExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                        <h3 className="text-lg font-medium">{t('graduationThesis.generalInformation')}</h3>
                                    </div>
                                </div>
                            </Paper>

                            {isGeneralExpanded && (
                                <div className="space-y-4">
                                    <FormControl fullWidth sx={{ mt: 1 }} error={!!errors.title}>
                                        <TextField
                                            required
                                            label={t('graduationThesis.title')}
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            error={!!errors.title}
                                            helperText={errors.title}
                                            fullWidth
                                            margin="normal"
                                        />
                                    </FormControl>

                                    <FormControl fullWidth sx={{ mt: 1 }}>
                                        <TextField
                                            label={t('graduationThesis.description')}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            multiline
                                            rows={4}
                                            fullWidth
                                            margin="normal"
                                        />
                                    </FormControl>

                                    <FormControl fullWidth sx={{ mt: 1 }}>
                                        <FormHelperText>{t('graduationThesis.objectives')}</FormHelperText>
                                        <RichTextEditor
                                            ref={editor}
                                            extensions={[StarterKit]}
                                            content={formData.objectives}
                                            onUpdate={({ editor }) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    objectives: editor.getHTML()
                                                }));
                                            }}
                                            renderControls={() => (
                                                <MenuControlsContainer>
                                                    <MenuSelectHeading />
                                                    <MenuDivider />
                                                    <MenuButtonBold />
                                                    <MenuButtonItalic />
                                                </MenuControlsContainer>
                                            )}
                                        />
                                    </FormControl>

                                    <FormControl fullWidth sx={{ mt: 1 }}>
                                        <FormHelperText>{t('graduationThesis.expectedResults')}</FormHelperText>
                                        <RichTextEditor
                                            extensions={[StarterKit]}
                                            content={formData.expectedResults}
                                            onUpdate={({ editor }) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    expectedResults: editor.getHTML()
                                                }));
                                            }}
                                            renderControls={() => (
                                                <MenuControlsContainer>
                                                    <MenuSelectHeading />
                                                    <MenuDivider />
                                                    <MenuButtonBold />
                                                    <MenuButtonItalic />
                                                </MenuControlsContainer>
                                            )}
                                        />
                                    </FormControl>

                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        <FormControl fullWidth>
                                            <DatePicker
                                                label={t('graduationThesis.startDate')}
                                                value={formData.startDate}
                                                onChange={(newValue: Dayjs | null) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        startDate: newValue
                                                    }));
                                                }}
                                                format="DD/MM/YYYY"
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        size: 'small'
                                                    }
                                                }}
                                            />
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <DatePicker
                                                label={t('graduationThesis.endDate')}
                                                value={formData.endDate}
                                                onChange={(newValue: Dayjs | null) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        endDate: newValue
                                                    }));
                                                }}
                                                format="DD/MM/YYYY"
                                                minDate={formData.startDate || undefined}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        size: 'small'
                                                    }
                                                }}
                                            />
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <DatePicker
                                                label={t('graduationThesis.assignedDate')}
                                                value={formData.assignedDate}
                                                onChange={(newValue: Dayjs | null) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        assignedDate: newValue
                                                    }));
                                                }}
                                                format="DD/MM/YYYY"
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        size: 'small'
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </div>

                                    <FormControl fullWidth error={!!errors.lecturerId} sx={{ mt: 2 }}>
                                        <Autocomplete
                                            options={teachers}
                                            getOptionLabel={(option) => option.fullName}
                                            value={teachers.find(t => t.id === formData.lecturerId) || null}
                                            onChange={(_event, newValue) => {
                                                setFormData({ ...formData, lecturerId: newValue?.id || '' });
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={t('graduationThesis.lecturer')}
                                                    error={!!errors.lecturerId}
                                                />
                                            )}
                                        />
                                        {errors.lecturerId && (
                                            <FormHelperText>{errors.lecturerId}</FormHelperText>
                                        )}
                                    </FormControl>
                                </div>
                            )}

                            <div className="mt-4">
                                <Paper 
                                    sx={{ 
                                        bgcolor: '#e3f2fd',
                                        mb: 1
                                    }}
                                >
                                    <div className="flex justify-between items-center p-2">
                                        <div className="flex items-center gap-2">
                                            <IconButton
                                                onClick={() => setIsStudentsExpanded(!isStudentsExpanded)}
                                                size="small"
                                            >
                                                {isStudentsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                            <h3 className="text-lg font-medium">{t('graduationThesis.students')}</h3>
                                        </div>
                                        <Button
                                            startIcon={<AddIcon />}
                                            onClick={handleAddStudent}
                                            disabled={formData.studentIds.length >= 5}
                                            size="small"
                                        >
                                            {t('graduationThesis.addStudent')}
                                        </Button>
                                    </div>
                                </Paper>
                                
                                {isStudentsExpanded && (
                                    <div className="space-y-2">
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
                                                                label={`${t('graduationThesis.students')} ${index + 1}`}
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
                                )}
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>{t('graduationThesis.cancel')}</Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                        >
                            {mode === 'add' ? t('graduationThesis.create') : t('graduationThesis.save')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </LocalizationProvider>
        </>
    );
}