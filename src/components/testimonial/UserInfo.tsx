
import React from 'react';

interface UserInfoProps {
  name: string;
  avatarUrl?: string;
  role?: string;
  company?: string;
  tags?: string[];
}

export const UserInfo: React.FC<UserInfoProps> = ({
  name,
  avatarUrl,
  role,
  company,
  tags
}) => {
  return (
    <div className="flex items-center">
      {avatarUrl ? (
        <div className="flex-shrink-0 mr-3">
          <img 
            src={avatarUrl} 
            alt={name} 
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border border-muted"
          />
        </div>
      ) : (
        <div className="flex-shrink-0 mr-3 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-medium">
            {name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
      )}
      
      <div className="min-w-0 max-w-[70%]">
        <h4 className="font-medium text-foreground truncate">{name}</h4>
        {(role || company) && (
          <p className="text-sm text-muted-foreground truncate">
            {role}{role && company && ' at '}{company}
          </p>
        )}
        {tags && tags.length > 0 && (
          <p className="text-xs text-primary mt-1 truncate">
            {tags.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};
