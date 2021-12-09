import { observer } from 'mobx-react-lite';
import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import ProfilePhotos from './tabs/ProfilePhotos';
import ProfileAbout from './tabs/ProfileAbout';
import { useStore } from '../../app/stores/store';

interface ProfileContentProps {
  profile: Profile;
}

const ProfileContent = ({ profile }: ProfileContentProps) => {
  const { profileStore } = useStore();

  const panes = [
    { menuItem: 'O mnie', render: () => <ProfileAbout /> },
    {
      menuItem: 'Zdjęcia',
      render: () => <ProfilePhotos profile={profile} />,
    },
  ];

  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition='right'
      panes={panes}
      onTabChange={(e, data) => profileStore.setActiveTab(data.activeIndex)}
    />
  );
};

export default observer(ProfileContent);
