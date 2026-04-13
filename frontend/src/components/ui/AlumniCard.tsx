import { MapPin, Briefcase, GraduationCap } from "lucide-react";
import { User } from "../../types";

interface Props {
  alumni: User;
  onClick: (alumni: User) => void;
}

const AlumniCard = ({ alumni, onClick }: Props) => {
  return (
    <div
      className="card p-5 cursor-pointer hover:-translate-y-1 transition-transform duration-200"
      onClick={() => onClick(alumni)}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {alumni.profileImage ? (
            <img
              src={alumni.profileImage}
              alt={`${alumni.firstName} ${alumni.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary-600 font-bold text-xl">
              {alumni.firstName[0]}
              {alumni.lastName[0]}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-lg">
            {alumni.firstName} {alumni.lastName}
          </h3>

          {alumni.currentJob && alumni.currentCompany && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <Briefcase className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {alumni.currentJob} at {alumni.currentCompany}
              </span>
            </div>
          )}

          {alumni.department && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <GraduationCap className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {alumni.department}
                {alumni.graduationYear &&
                  ` • Class of ${alumni.graduationYear}`}
              </span>
            </div>
          )}

          {alumni.location && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{alumni.location}</span>
            </div>
          )}
        </div>
      </div>

      {alumni.bio && (
        <p className="text-sm text-gray-500 mt-3 line-clamp-2">{alumni.bio}</p>
      )}
    </div>
  );
};

export default AlumniCard;
