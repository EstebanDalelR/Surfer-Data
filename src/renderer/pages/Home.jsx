import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentRoute, updateBreadcrumb } from '../state/actions';
import DataExtractionTable from '../components/profile/DataExtractionTable';
import RunDetailsPage from '../components/profile/RunDetailsPage';
import { platforms } from '../config/platforms';

const Home = () => {
  const dispatch = useDispatch();
  const handlePlatformClick = (platform) => {
    dispatch(setCurrentRoute(`/platform/${platform.id}`, { platform }));
    dispatch(updateBreadcrumb([
      { text: 'Home', link: '/home' },
      { text: platform.name, link: `/platform/${platform.id}` },
    ]));
  };

  return (
    <div className="w-full flex flex-col bg-background h-screen">
      <div className="flex-grow overflow-hidden">
        <DataExtractionTable
          onPlatformClick={handlePlatformClick}
        />
      </div>
    </div>
  );
};

export default Home;
