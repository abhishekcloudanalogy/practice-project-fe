import { format } from "date-fns";

export interface Holiday {
    id: string;
    title: string;
    start: Date;
    end: Date;
    isHoliday: true;
    floater?: boolean; // For festivals that don't have a fixed date
}

// Indian Festival Dates - Note: Lunar-based festivals vary by year
// These are approximate dates for reference, actual dates should be verified
const indianFestivalDates: Record<number, Array<{ id: string; title: string; month: number; date: number; floater?: boolean }>> = {
    2024: [
        { id: "republic-day", title: "Republic Day", month: 0, date: 26 },
        { id: "holi", title: "Holi", month: 2, date: 25 },
        { id: "good-friday", title: "Good Friday", month: 2, date: 29 },
        { id: "eid-fitr", title: "Eid ul-Fitr", month: 3, date: 10 },
        { id: "ramnavami", title: "Ram Navami", month: 3, date: 17 },
        { id: "mahavir-jayanti", title: "Mahavir Jayanti", month: 3, date: 21 },
        { id: "eid-adha", title: "Eid ul-Adha", month: 5, date: 17 },
        { id: "independence-day", title: "Independence Day", month: 7, date: 15 },
        { id: "janmashtami", title: "Janmashtami", month: 7, date: 26 },
        { id: "ganesh-chaturthi", title: "Ganesh Chaturthi", month: 8, date: 7 },
        { id: "dussehra", title: "Dussehra", month: 9, date: 12 },
        { id: "diwali", title: "Diwali", month: 10, date: 1 },
        { id: "guru-nanak", title: "Guru Nanak Jayanti", month: 10, date: 15 },
        { id: "christmas", title: "Christmas", month: 11, date: 25 },
    ],
    2025: [
        { id: "republic-day", title: "Republic Day", month: 0, date: 26 },
        { id: "holi", title: "Holi", month: 2, date: 14 },
        { id: "good-friday", title: "Good Friday", month: 3, date: 18 },
        { id: "eid-fitr", title: "Eid ul-Fitr", month: 2, date: 30 },
        { id: "ramnavami", title: "Ram Navami", month: 3, date: 6 },
        { id: "mahavir-jayanti", title: "Mahavir Jayanti", month: 3, date: 10 },
        { id: "eid-adha", title: "Eid ul-Adha", month: 5, date: 7 },
        { id: "independence-day", title: "Independence Day", month: 7, date: 15 },
        { id: "janmashtami", title: "Janmashtami", month: 8, date: 16 },
        { id: "ganesh-chaturthi", title: "Ganesh Chaturthi", month: 8, date: 27 },
        { id: "dussehra", title: "Dussehra", month: 9, date: 2 },
        { id: "diwali", title: "Diwali", month: 10, date: 20 },
        { id: "guru-nanak", title: "Guru Nanak Jayanti", month: 10, date: 30 },
        { id: "christmas", title: "Christmas", month: 11, date: 25 },
    ],
    2026: [
        { id: "new-year", title: "New Year", month: 0, date: 1 },

        { id: "pongal", title: "Pongal / Makar Sankranti", month: 0, date: 14, floater: true },

        { id: "republic-day", title: "Republic Day", month: 0, date: 26 },

        { id: "holi", title: "Holi", month: 2, date: 29 },

        { id: "ugadi", title: "Ugadi / Gudi Padwa", month: 2, date: 19, floater: true },

        { id: "eid-fitr", title: "Eid ul-Fitr", month: 2, date: 30, floater: true },

        { id: "good-friday", title: "Good Friday", month: 3, date: 10 },

        { id: "vaisakhi", title: "Vaisakhi", month: 3, date: 14, floater: true },

        { id: "ramnavami", title: "Ram Navami", month: 3, date: 21 },

        { id: "mahavir-jayanti", title: "Mahavir Jayanti", month: 3, date: 2 },

        { id: "eid-adha", title: "Eid ul-Adha (Bakrid)", month: 5, date: 27 },

        { id: "independence-day", title: "Independence Day", month: 7, date: 15 },

        { id: "onam", title: "Onam / Milad un-Nabi (Tentative Date)", month: 7, date: 25, floater: true },

        { id: "raksha-bandhan", title: "Raksha Bandhan (Rakhi)", month: 7, date: 28, floater: true },

        { id: "janmashtami", title: "Janmashtami", month: 8, date: 5, floater: true },

        { id: "ganesh-chaturthi", title: "Ganesh Chaturthi", month: 8, date: 16, floater: true },

        { id: "gandhi-jayanti", title: "Mahatma Gandhi Jayanti", month: 9, date: 2 },

        { id: "dussehra", title: "Dussehra", month: 9, date: 12 },

        { id: "diwali", title: "Diwali", month: 10, date: 8 },

        { id: "govardhan-puja", title: "Govardhan Puja", month: 10, date: 10, floater: true },

        { id: "bhai-dooj", title: "Bhai Dooj", month: 10, date: 11, floater: true },

        { id: "guru-nanak", title: "Guru Nanak Jayanti", month: 11, date: 30 },

        { id: "christmas", title: "Christmas", month: 11, date: 25 },
    ],
    2027: [
        { id: "republic-day", title: "Republic Day", month: 0, date: 26 },
        { id: "holi", title: "Holi", month: 2, date: 18 },
        { id: "good-friday", title: "Good Friday", month: 3, date: 2 },
        { id: "eid-fitr", title: "Eid ul-Fitr", month: 2, date: 10 },
        { id: "ramnavami", title: "Ram Navami", month: 3, date: 10 },
        { id: "mahavir-jayanti", title: "Mahavir Jayanti", month: 3, date: 21 },
        { id: "eid-adha", title: "Eid ul-Adha", month: 5, date: 16 },
        { id: "independence-day", title: "Independence Day", month: 7, date: 15 },
        { id: "janmashtami", title: "Janmashtami", month: 8, date: 24 },
        { id: "ganesh-chaturthi", title: "Ganesh Chaturthi", month: 8, date: 5 },
        { id: "dussehra", title: "Dussehra", month: 10, date: 1 },
        { id: "diwali", title: "Diwali", month: 10, date: 29 },
        { id: "guru-nanak", title: "Guru Nanak Jayanti", month: 11, date: 30 },
        { id: "christmas", title: "Christmas", month: 11, date: 25 },
    ],
};

// Get Indian Festivals for a given year
export function getIndianFestivals(year: number): Holiday[] {
    const festivals = indianFestivalDates[year] || [];

    return festivals.map((festival) => ({
        id: festival.id,
        title: festival.title,
        start: new Date(year, festival.month, festival.date),
        end: new Date(year, festival.month, festival.date),
        isHoliday: true,
    }));
}

// Get holidays for current and adjacent years (useful for year transitions)
export function getHolidaysForDateRange(startDate: Date, endDate: Date): Holiday[] {
    const holidays: Holiday[] = [];
    const years = new Set<number>();

    // Collect all years in the range
    let current = new Date(startDate);
    while (current <= endDate) {
        years.add(current.getFullYear());
        current.setMonth(current.getMonth() + 1);
    }

    // Get holidays for all years
    years.forEach((year) => {
        holidays.push(...getIndianFestivals(year));
    });

    // Filter to only holidays in the date range
    return holidays.filter((h) => h.start >= startDate && h.start <= endDate);
}
