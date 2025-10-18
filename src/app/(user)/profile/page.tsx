/** @format */

"use client";

import React from "react";
import Image from "next/image";
import {
  User,
  MapPin,
  Calendar,
  Award,
  Music,
  Users,
  Star,
} from "lucide-react";

const ProfilePage: React.FC = () => {
  const achievements = [
    {
      icon: Music,
      title: "Label Musik Profesional",
      description:
        "Label musik independen pertama di Papua dengan berbagai layanan kreatif",
    },
    {
      icon: Users,
      title: "Wadah Talenta",
      description:
        "Platform pengembangan talenta musik Papua dan inovasi budaya",
    },
    {
      icon: Award,
      title: "Kontribusi Musik",
      description:
        "Memperkenalkan identitas budaya Papua ke industri musik Indonesia Timur",
    },
  ];

  const milestones = [
    { year: "2015", event: "Berdiri dengan nama Colombo Sound" },
    { year: "2018-2019", event: "Berganti nama menjadi Kejorap Still Star" },
    { year: "2020", event: "Resmi menjadi Rum Fararur Production" },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary via-secondary to-accent py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <User size={64} className="mx-auto mb-6 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Profil Rum Fararur
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Label musik independen pertama di Papua yang menghadirkan inovasi
              dan kreativitas
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <span>Papua, Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <span>Berdiri sejak 2015</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Overview Card */}
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Logo and Image Section */}
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative mb-6">
                    <Image
                      src="/images/logo_black.png"
                      alt="Rum Fararur Logo"
                      width={200}
                      height={200}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="relative mb-6">
                    <Image
                      src="/images/pendiri.jpg"
                      alt="Pendiri Rum Fararur - Epo D'Fenomeno"
                      width={150}
                      height={150}
                      className="rounded-full object-cover shadow-lg border-4 border-primary"
                    />
                  </div>
                  <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold mb-2">Rum Fararur</h2>
                    <p className="text-lg text-base-content/70 mb-4">
                      Fararur Beba, Wor Beba
                    </p>
                    <div className="badge badge-primary badge-lg">
                      Label Musik Profesional
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-4">
                  <p className="text-base-content/80 leading-relaxed">
                    <strong className="text-primary">Rum Fararur</strong>{" "}
                    berasal dari bahasa suku Biak, Papua, yang berarti
                    <em className="text-accent">
                      {" "}
                      &ldquo;Rumah (Rum) dan Kerja (Fararur)&rdquo;
                    </em>
                    . Filosofinya adalah
                    <em className="text-accent">
                      {" "}
                      &ldquo;Kerja di rumah adalah salah satu solusi dari
                      inovasi yang bisa kita buat di Papua.&rdquo;
                    </em>
                  </p>
                  <p className="text-base-content/80 leading-relaxed">
                    Di bawah nama utama Rum Fararur, terdapat sub-label
                    <strong className="text-secondary">
                      {" "}
                      Fararur Beba, Wor Beba
                    </strong>
                    , yang dalam bahasa Indonesia berarti
                    <em className="text-accent">
                      {" "}
                      &ldquo;Pekerjaan Besar untuk Perayaan yang Besar.&rdquo;
                    </em>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={index}
                  className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="card-body items-center text-center">
                    <div className="p-3 bg-primary/10 rounded-full mb-4">
                      <IconComponent size={32} className="text-primary" />
                    </div>
                    <h3 className="card-title text-lg">{achievement.title}</h3>
                    <p className="text-base-content/70 text-sm">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* History Section */}
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-secondary/10 rounded-full">
                  <Star size={24} className="text-secondary" />
                </div>
                <h2 className="card-title text-2xl">Sejarah Perjalanan</h2>
              </div>

              <div className="space-y-6">
                <p className="text-base-content/80 leading-relaxed">
                  <strong className="text-primary">
                    Rum Fararur Production
                  </strong>{" "}
                  merupakan label musik independen profesional pertama di Papua.
                  Label ini didirikan oleh{" "}
                  <strong>
                    Onesias Chelvox Urbinas (a.k.a. Epo D&rsquo;Fenomeno)
                  </strong>{" "}
                  sebagai pendiri dan pemilik resmi.
                </p>

                {/* Timeline */}
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-base-300"></div>
                  <div className="space-y-4">
                    {milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className="relative flex items-start gap-4 pl-12"
                      >
                        <div className="absolute left-2 w-4 h-4 bg-primary rounded-full border-4 border-base-100 -translate-x-2"></div>
                        <div className="flex-1">
                          <div className="badge badge-primary mb-2">
                            {milestone.year}
                          </div>
                          <p className="text-base-content/80">
                            {milestone.event}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-base-content/80 leading-relaxed">
                  Sejak berdiri, Rum Fararur Production terus berkembang menjadi
                  wadah bagi talenta-talenta musik Papua untuk berkarya,
                  berinovasi, dan memperkenalkan identitas budaya Papua ke
                  kancah yang lebih luas.
                </p>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">
                Layanan & Unit Kreatif
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <Music size={20} className="text-primary" />
                    <span>Studio Rekaman & Produksi Musik</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <Users size={20} className="text-primary" />
                    <span>Manajemen Artis</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <Award size={20} className="text-primary" />
                    <span>Penerbit Digital</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <Calendar size={20} className="text-primary" />
                    <span>Penyelenggara Event Hip-Hop</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <Star size={20} className="text-primary" />
                    <span>Layanan Desain & Videografi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="text-center mt-8 p-6 bg-base-100 rounded-lg shadow">
            <div className="flex flex-col items-center gap-4">
              <Image
                src="/images/pendiri.jpg"
                alt="Pendiri Rum Fararur - Epo D'Fenomeno"
                width={80}
                height={80}
                className="rounded-full object-cover border-2 border-primary"
              />
              <div className="text-lg font-semibold text-base-content">
                <p>Onesias Chelvox Urbinas (a.k.a. Epo D&rsquo;Fenomeno)</p>
                <p className="text-base-content/70">
                  Pendiri & Pemilik Rum Fararur Production
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
