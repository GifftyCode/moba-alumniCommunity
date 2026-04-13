import { Calendar, Eye, Tag } from "lucide-react";
import { News } from "../../types";
import { Link } from "react-router-dom";

interface Props {
  news: News;
}

const categoryColors: Record<string, string> = {
  news: "bg-blue-100 text-blue-700",
  gist: "bg-purple-100 text-purple-700",
  community: "bg-green-100 text-green-700",
  announcement: "bg-gold-100 text-gold-700",
};

const NewsCard = ({ news }: Props) => {
  return (
    <Link to={`/news/${news._id}`}>
      <div className="card overflow-hidden group">
        {news.image && (
          <div className="h-48 overflow-hidden">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${categoryColors[news.category]}`}
            >
              {news.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Eye className="w-3 h-3" />
              <span>{news.views}</span>
            </div>
          </div>

          <h3 className="font-semibold text-gray-800 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {news.title}
          </h3>

          <p className="text-gray-500 text-sm line-clamp-3 mb-4">
            {news.content}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xs">
                  {news.author?.firstName?.[0]}
                  {news.author?.lastName?.[0]}
                </span>
              </div>
              <span>
                {news.author?.firstName} {news.author?.lastName}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(news.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {news.tags?.length > 0 && (
            <div className="flex items-center gap-1 mt-3 flex-wrap">
              <Tag className="w-3 h-3 text-gray-400" />
              {news.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
