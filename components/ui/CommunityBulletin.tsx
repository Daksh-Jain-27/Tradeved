import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const announcements = [
    {
      id: "1",
      iconName: "award",
      title: "Weekend Championship",
      content: "Join the Options Trading Championship this weekend with a prize pool of ₹50,000!",
      date: "Starts in 2 days",
      cta: {
        text: "Register Now",
        link: "/competitions",
      },
      color: "#FACC15", // middle-yellow
    },
    {
      id: "2",
      iconName: "star",
      title: "New Leaderboard Champion",
      content: "Sarah Investor has claimed the #1 spot with an ELO rating of 2150!",
      date: "Today",
      cta: {
        text: "View Leaderboard",
        link: "/leaderboard",
      },
      color: "#38BDF8", // brilliant-azure
    },
    {
      id: "3",
      iconName: "bell",
      title: "Platform Update v2.4",
      content: "New features added: Group Rooms, Power-up System, and Profile Customization",
      date: "3 days ago",
      color: "#A3E635", // mango-green
    },
    {
      id: "4",
      iconName: "users",
      title: "New Learning Content",
      content: "Options Trading Advanced Course now available in the Learning Hub",
      date: "1 week ago",
      cta: {
        text: "Explore Now",
        link: "/learning-hub",
      },
      color: "#F87171", // royal-red
    },
];

type CommunityBulletinProps = {
  onNavigate?: (link: string) => void;
};

export function CommunityBulletin({ onNavigate }: CommunityBulletinProps) {
  // onNavigate is a placeholder for a function passed via props to handle navigation, e.g., from react-navigation

  const handlePress = (link: string) => {
    if (onNavigate && typeof onNavigate === 'function') {
      onNavigate(link);
    } else {
      console.log(`Navigate to: ${link}`);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Icon name="bell" size={20} color="#A3E635" />
        <Text style={styles.cardTitle}>Community Bulletin</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {announcements.map((announcement) => (
          <TouchableOpacity key={announcement.id} style={styles.announcementItem} onPress={() => announcement.cta && handlePress(announcement.cta.link)}>
              <View style={styles.announcementHeader}>
                <View style={styles.announcementTitleContainer}>
                    <Icon name={announcement.iconName} size={20} color={announcement.color} style={styles.announcementIcon} />
                    <View style={styles.announcementTextContainer}>
                        <Text style={styles.announcementTitle}>{announcement.title}</Text>
                        <Text style={styles.announcementContent}>{announcement.content}</Text>
                    </View>
                </View>
                <View style={styles.badge}>
                    <Icon name="calendar" size={12} color="#9CA3AF" />
                    <Text style={styles.badgeText}>{announcement.date}</Text>
                </View>
              </View>

              {announcement.cta && (
                <View style={styles.ctaContainer}>
                  <Text style={styles.ctaText}>{announcement.cta.text}</Text>
                  <Icon name="arrow-right" size={14} color="#A3E635" />
                </View>
              )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.viewAllButton} onPress={() => handlePress('/announcements')}>
          <Text style={styles.viewAllButtonText}>View All Announcements</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 8,
    },
    content: {
        gap: 16,
    },
    announcementItem: {
        borderWidth: 1,
        borderColor: '#374151',
        borderRadius: 8,
        padding: 16,
        gap: 12,
    },
    announcementHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    announcementTitleContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    announcementIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    announcementTextContainer: {
      flex: 1,
    },
    announcementTitle: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 4,
    },
    announcementContent: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#4B5563',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginLeft: 8,
    },
    badgeText: {
        color: '#9CA3AF',
        fontSize: 12,
        marginLeft: 4,
    },
    ctaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 8,
    },
    ctaText: {
        color: '#A3E635',
        fontSize: 14,
        fontWeight: '500',
        marginRight: 4,
    },
    viewAllButton: {
        borderWidth: 1,
        borderColor: '#4B5563',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    viewAllButtonText: {
        color: '#FFF',
        fontWeight: '500',
    },
}); 