import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CalendarDay {
    date: number;
    amount: string;
    trades: number;
    icon1Count: number;
    icon2Count: number;
    dayName: string;
}

interface JournalNote {
    id: string;
    title: string;
    date: string;
    content: string;
    tags: string[];
}

const generateMonthDays = (date: Date): CalendarDay[] => {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
        const currentDate = new Date(date.getFullYear(), date.getMonth(), i + 1);
        return {
            date: i + 1,
            amount: `₹${Math.floor(Math.random() * 30)}.${Math.floor(Math.random() * 9)}k`,
            trades: Math.floor(Math.random() * 5) + 1,
            icon1Count: Math.floor(Math.random() * 3),
            icon2Count: Math.floor(Math.random() * 3),
            dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' })
        };
    });
};

const currentDate = new Date(2024, 6); // July 2024
const monthDays = generateMonthDays(currentDate);

const tags = [
    'User Management',
    'Transaction Monitor',
    'Marketing Tools',
    'Analytics and Reporting',
    'Security',
    'CRM'
];

const tagColors = {
    'User Management': '#ff9eb6',
    'Transaction Monitor': '#ffd600',
    'Marketing Tools': '#9bec00',
    'Analytics and Reporting': '#00b4d8',
    'Security': '#a855f7',
    'CRM': '#fbcfe8'
};

export default function JournalEntry() {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [showAddNote, setShowAddNote] = useState(false);
    const [editingNote, setEditingNote] = useState<JournalNote | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [savedNotes, setSavedNotes] = useState<JournalNote[]>([
        {
            id: '1',
            title: 'Title of the note 1',
            date: '30 March, 2024',
            content: 'Lorem ipsum dolor sit amet consectetur. Pretium risus hac eu nec auctor vitae nunc varius laoreet. Dictum ullamcorper praesent aliquam nulla morbi elementum fuctor.',
            tags: ['User Management', 'Transaction Monitor', 'Marketing Tools']
        },
        {
            id: '2',
            title: 'Title of the note 1',
            date: '30 March, 2024',
            content: 'Lorem ipsum dolor sit amet consectetur. Pretium risus hac eu nec auctor vitae nunc varius laoreet. Dictum ullamcorper praesent aliquam nulla morbi elementum fuctor.',
            tags: ['User Management', 'Transaction Monitor', 'Marketing Tools']
        }
    ]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<JournalNote | null>(null);
    const router = useRouter();

    const handleTagPress = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const removeTag = (tagToRemove: string) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    };

    const handleEdit = (note: JournalNote) => {
        setTitle(note.title);
        setNotes(note.content);
        setSelectedTags(note.tags);
        setEditingNote(note);
        setShowAddNote(true);
    };

    const handleSave = () => {
        if (title.trim() && notes.trim()) {
            const newNote: JournalNote = {
                id: editingNote?.id || Date.now().toString(),
                title: title.trim(),
                date: editingNote?.date || new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
                content: notes.trim(),
                tags: selectedTags
            };

            if (editingNote) {
                setSavedNotes(savedNotes.map(note => 
                    note.id === editingNote.id ? newNote : note
                ));
            } else {
                setSavedNotes([newNote, ...savedNotes]);
            }

            setTitle('');
            setNotes('');
            setSelectedTags([]);
            setEditingNote(null);
            setShowAddNote(false);
        }
    };

    const handleCancel = () => {
        if (title.trim() || notes.trim() || selectedTags.length > 0) {
            setShowCancelModal(true);
        } else {
            setShowAddNote(false);
        }
    };

    const handleConfirmCancel = () => {
        setTitle('');
        setNotes('');
        setSelectedTags([]);
        setEditingNote(null);
        setShowAddNote(false);
        setShowCancelModal(false);
    };

    const handleTagInput = (text: string) => {
        setTagInput(text);
        if (text.endsWith(' ') && text.trim()) {
            const newTag = text.trim();
            if (!selectedTags.includes(newTag) && tags.includes(newTag)) {
                setSelectedTags([...selectedTags, newTag]);
            }
            setTagInput('');
        }
    };

    const handleDeleteNote = (note: JournalNote) => {
        setNoteToDelete(note);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (noteToDelete) {
            setSavedNotes(savedNotes.filter(note => note.id !== noteToDelete.id));
        }
        setShowDeleteModal(false);
        setNoteToDelete(null);
    };

    const renderCancelModal = () => (
        <Modal
            transparent
            visible={showCancelModal}
            animationType="fade"
            onRequestClose={() => setShowCancelModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Notes will not be saved.</Text>
                    <Text style={styles.modalText}>Are you sure you want to discard?</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity 
                            style={styles.modalButton} 
                            onPress={() => setShowCancelModal(false)}
                        >
                            <Text style={styles.modalButtonText}>No, keep</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.modalButton, styles.discardButton]} 
                            onPress={handleConfirmCancel}
                        >
                            <Text style={styles.modalButtonText}>Yes, discard</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderDeleteModal = () => (
        <Modal
            transparent
            visible={showDeleteModal}
            animationType="fade"
            onRequestClose={() => setShowDeleteModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Delete Note</Text>
                    <Text style={styles.modalText}>Are you sure you want to delete this note?</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity 
                            style={styles.modalButton} 
                            onPress={() => setShowDeleteModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.modalButton, styles.deleteButton]} 
                            onPress={handleConfirmDelete}
                        >
                            <Text style={styles.modalButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderAddNoteForm = () => (
        <>
            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Add Title</Text>
                <TextInput
                    style={styles.titleInput}
                    placeholder="Type your title"
                    placeholderTextColor="#666"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>

            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Add tags</Text>
                <View style={styles.tagInputContainer}>
                    {selectedTags.length > 0 ? (
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            style={styles.selectedTagsScroll}
                            contentContainerStyle={styles.selectedTagsContent}
                        >
                            {selectedTags.map((tag, index) => (
                                <View 
                                    key={index} 
                                    style={[
                                        styles.selectedTag,
                                        { backgroundColor: tagColors[tag as keyof typeof tagColors] }
                                    ]}
                                >
                                    <Text style={styles.selectedTagText}>{tag}</Text>
                                    <TouchableOpacity onPress={() => removeTag(tag)}>
                                        <Ionicons name="close-circle" size={16} color="#000" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        <TextInput
                            style={styles.tagInput}
                            placeholder="Type new tags to add new tags"
                            placeholderTextColor="#666"
                            value={tagInput}
                            onChangeText={handleTagInput}
                        />
                    )}
                </View>
                <View style={styles.tagsContainer}>
                    {tags.map((tag, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleTagPress(tag)}
                            style={[
                                styles.tagButton,
                                selectedTags.includes(tag) && styles.selectedTagButton,
                                selectedTags.includes(tag) && { backgroundColor: tagColors[tag as keyof typeof tagColors] }
                            ]}
                        >
                            <Text style={[
                                styles.tagText,
                                { color: tagColors[tag as keyof typeof tagColors] },
                                selectedTags.includes(tag) && styles.selectedTagButtonText
                            ]}>
                                {tag}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Notes</Text>
                <TextInput
                    style={styles.notesInput}
                    placeholder="Fill this in later"
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={4}
                    value={notes}
                    onChangeText={setNotes}
                />
            </View>

            <View style={styles.bottomButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadButton}>
                    <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </>
    );

    const renderSavedNotes = () => (
        <View style={styles.savedNotesSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Previous Journals</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>
            {savedNotes.map((note, index) => (
                <View key={index} style={styles.noteCard}>
                    <View style={styles.noteHeader}>
                        <Text style={styles.noteTitle}>{note.title}</Text>
                        <Text style={styles.noteDate}>{note.date}</Text>
                    </View>
                    <Text style={styles.noteContent}>{note.content}</Text>
                    <View style={styles.noteTags}>
                        {note.tags.map((tag, tagIndex) => (
                            <View 
                                key={tagIndex} 
                                style={[
                                    styles.noteTag,
                                    { backgroundColor: tagColors[tag as keyof typeof tagColors] }
                                ]}
                            >
                                <Text style={styles.noteTagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.noteActions}>
                        <TouchableOpacity 
                            style={styles.editButton}
                            onPress={() => handleEdit(note)}
                        >
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.deleteButton}
                            onPress={() => handleDeleteNote(note)}
                        >
                            <Ionicons name="trash-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />
            <ScrollView 
                style={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContentContainer}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                        <Text style={styles.headerTitle}>My Data Journal</Text>
                    </TouchableOpacity>
                </View>

                {/* Date Section */}
                <Text style={styles.dateText}>July, 2024</Text>

                {/* Calendar Day Cards */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    style={styles.cardsContainer}
                    contentContainerStyle={styles.cardsContent}
                >
                    {monthDays.map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.dayCard,
                                selectedDay === day.date && styles.selectedDay
                            ]}
                            onPress={() => setSelectedDay(day.date)}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.amountText}>{day.amount}</Text>
                                <Text style={styles.dateNumber}>{day.date.toString().padStart(2, '0')}</Text>
                            </View>
                            <Text style={styles.tradesText}>{day.trades} Trades</Text>
                            <View style={styles.bottomRow}>
                                <View style={styles.iconsRow}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="book" size={9} color="#000" />
                                        <Text style={styles.iconCount}>{day.icon1Count}</Text>
                                    </View>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="book" size={9} color="#000" />
                                        <Text style={styles.iconCount}>{day.icon2Count}</Text>
                                    </View>
                                </View>
                                <Text style={styles.dayName}>{day.dayName}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {showAddNote ? (
                    renderAddNoteForm()
                ) : (
                    <>
                        {renderSavedNotes()}
                        <TouchableOpacity 
                            style={[styles.addNoteButton, styles.addNoteButtonFixed]}
                            onPress={() => setShowAddNote(true)}
                        >
                            <Text style={styles.addNoteButtonText}>Add new note</Text>
                        </TouchableOpacity>
                    </>
                )}
                <View style={styles.bottomPadding} />
            </ScrollView>
            {renderCancelModal()}
            {renderDeleteModal()}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242620',
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: '#242620',
    },
    scrollContentContainer: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 90 : 70,
    },
    bottomPadding: {
        height: 50,
        backgroundColor: '#242620',
    },
    header: {
        marginTop: 40,
        marginBottom: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    dateText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 16,
    },
    cardsContainer: {
        marginBottom: 24,
    },
    cardsContent: {
        paddingRight: 16,
    },
    dayCard: {
        minWidth: 97,
        minHeight: 54,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 8,
        marginRight: 12,
        backgroundColor: '#9bec00',
        justifyContent: 'space-between',
    },
    selectedDay: {
        borderWidth: 2,
        borderColor: '#fff',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,
    },
    amountText: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold',
    },
    dateNumber: {
        color: '#000',
        fontSize: 9,
        fontWeight: '600',
    },
    tradesText: {
        color: '#000',
        fontSize: 9,
    },
    iconsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    iconCount: {
        color: '#000',
        fontSize: 9,
    },
    dayName: {
        color: '#000',
        fontSize: 9,
    },
    savedNotesSection: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    viewAllText: {
        color: '#9bec00',
        fontSize: 12,
    },
    noteCard: {
        backgroundColor: '#31332b',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    noteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    noteTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    noteDate: {
        color: '#666',
        fontSize: 12,
    },
    noteContent: {
        color: '#999',
        fontSize: 12,
        marginBottom: 12,
        lineHeight: 18,
    },
    noteTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    noteTag: {
        backgroundColor: '#ff9eb6',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    noteTagText: {
        color: '#000',
        fontSize: 12,
    },
    editButton: {
        backgroundColor: '#9bec00',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'flex-end',
    },
    editButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '600',
    },
    addNoteButton: {
        backgroundColor: '#9bec00',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    addNoteButtonFixed: {
        marginBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    addNoteButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    inputSection: {
        marginBottom: 24,
    },
    inputLabel: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 8,
    },
    titleInput: {
        backgroundColor: '#31332b',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: 14,
    },
    tagInputContainer: {
        backgroundColor: '#31332b',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        minHeight: 48,
    },
    tagInput: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 8,
    },
    selectedTagsScroll: {
        flexGrow: 0,
    },
    selectedTagsContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    selectedTag: {
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    selectedTagText: {
        color: '#000',
        fontSize: 12,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagButton: {
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 1,
    },
    selectedTagButton: {
        borderWidth: 0,
    },
    tagText: {
        fontSize: 12,
    },
    selectedTagButtonText: {
        color: '#000',
    },
    notesInput: {
        backgroundColor: '#31332b',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: 14,
        height: 100,
        textAlignVertical: 'top',
    },
    bottomButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
        marginBottom: 40,
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#9bec00',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: 'transparent',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    uploadButton: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#31332b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#31332b',
        borderRadius: 8,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    modalText: {
        color: '#999',
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        backgroundColor: '#242620',
    },
    discardButton: {
        backgroundColor: '#dc2626',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    noteActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 12,
    },
    deleteButton: {
        backgroundColor: '#dc2626',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
}); 