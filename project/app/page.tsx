"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

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

export default function Home() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-primary-50 bg-dotter-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">Mikpritës, Ndërlidhës dhe Inspirues: Platforma Juaj për Eventet e UMIB-it</h1>
            <p className="p-regular-20 md:regular-24">
              Organizo dhe eksploro aktivitete që lidhin studentët, klubet dhe fakultetet, duke sjellë ide dhe mundësi të reja për të gjithë komunitetin universitar.
            </p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">Zbulo më Shumë</Link>
            </Button>
          </div>

          <Image 
            src="/assets/images/hero.png"
            alt="heroImage"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>

      <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Platforma e Preferuar <br/> për Eventet</h2>
        <div className="flex w-full flex-col gap-5 md:flex-row">
          Kërkoni
          KategoriFilter
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* <div className="w-full md:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Event Calendar</CardTitle>
                  <CardDescription>Browse events by date</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                </CardContent>
              </Card>
            </div> */}

            <div className="w-full md:w-2/3">
              <div className="grid gap-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold">Featured Events</h1>
                  {user && (
                    <Button asChild>
                      <Link href="/create">Create Event</Link>
                    </Button>
                  )}
                </div>
                
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                      <Card key={n}>
                        <CardContent className="p-6">
                          <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                            <div className="flex gap-4">
                              <div className="h-4 bg-muted rounded w-24"></div>
                              <div className="h-4 bg-muted rounded w-24"></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  events.map((event) => (
                    <Card key={event._id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>
                              <Link href={`/events/${event._id}`} className="hover:underline">
                                {event.title}
                              </Link>
                            </CardTitle>
                            <CardDescription>{event.description}</CardDescription>
                          </div>
                          {user && (
                            <Button variant="outline" asChild className="mt-2">
                              <Link href={`/events/${event._id}`}>View Details</Link>
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-6">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Capacity: {event.capacity}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}