"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, MapPin, Tag, User, Share2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  category: string;
  organizer: {
    _id: string;
    name: string;
  };
}

export default function EventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, token } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        const res = await fetch(`/api/events/${params.id}`); // Fetch single event
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        
        const data = await res.json();
        setEvent(data);  // ✅ Update event state
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false); // ✅ Ensure loading state is updated
      }
    }
  
    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  async function handleRegister() {
    if (!user) {
      router.push("/login");
      return;
    }

    setRegistering(true);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ eventId: event?._id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }
      
      toast.success("Successfully registered for event");
      router.push("/registrations");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to register for event");
    } finally {
      setRegistering(false);
    }
  }

  async function handleShare() {
    try {
      await navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying the URL
      navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied to clipboard");
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) return null;

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="overflow-hidden">
        <div className="bg-primary/10 p-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Organized by {event.organizer.name}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                {isUpcoming && user && (
                  <Button onClick={handleRegister} disabled={registering}>
                    {registering ? "Registering..." : "Register for Event"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">About this Event</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Event Details</h2>
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Date and Time</p>
                      <p className="text-muted-foreground">
                        {format(eventDate, "EEEE, MMMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-muted-foreground">{event.capacity} attendees</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Tag className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Category</p>
                      <p className="text-muted-foreground">{event.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Information</CardTitle>
                  <CardDescription>Important details about the event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isUpcoming ? 'Upcoming' : 'Past Event'}
                    </span>
                  </div>
                  {!user && (
                    <Button className="w-full" onClick={() => router.push('/login')}>
                      Login to Register
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}