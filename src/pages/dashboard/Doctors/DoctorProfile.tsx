
import { Mail, Phone, Star } from "lucide-react"
import { useState } from "react"

interface DoctorProfileProps {
  doctor: {
    name: string
    status: string
    rating: string
    email: string
    phone: string
  }
}

export default function DoctorProfile({ doctor }: DoctorProfileProps) {

  const [activeTab, setActiveTab] = useState("overview")

  console.log("Doctor data in profile:", doctor)



  return (
    <div className="min-h-screen  ">
    

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Doctor"
              className="h-28 w-28 rounded-full object-cover"
            />

            <h2 className="text-2xl font-semibold mt-4">
              {doctor.name}
            </h2>

            <span className="mt-2 px-4 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">
              {doctor.status || "Available"}
            </span>

            <div className="flex items-center gap-2 mt-3 text-gray-600">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{doctor.rating || "4.8"}</span>
              <span>• 87 reviews</span>
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-gray-500 text-sm">
                  {doctor.email || "Not Provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-gray-500 text-sm">
                  {doctor.phone || "Not Provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex gap-4 bg-white dark:bg-gray-800 p-2 rounded-xl shadow">
            {["overview", "appointments", "patients", "performance"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg capitalize text-sm font-medium transition ${
                    activeTab === tab
                      ? "border-2  bg-gray-100 dark:bg-gray-700"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Overview Content */}
          {activeTab === "overview" && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  About
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Dr. Sarah Johnson is a board-certified cardiologist
                  with over 8 years of experience in diagnosing and
                  treating heart conditions. She specializes in
                  preventive cardiology and heart failure management.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Education & Certifications
                </h3>

                <div className="space-y-3">
                  
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">MD</p>
                      <p className="text-sm text-gray-500">
                        Harvard Medical School
                      </p>
                    </div>
                    <span className="text-gray-500">2012</span>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">
                        Board Certification
                      </p>
                      <p className="text-sm text-gray-500">
                        American Board of Cardiology
                      </p>
                    </div>
                    <span className="text-gray-500">2014</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "appointments" && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-semibold">
                Appointments Section
              </h3>
            </div>
          )}

          {activeTab === "patients" && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-semibold">
                Patients Section
              </h3>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-semibold">
                Performance Section
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
