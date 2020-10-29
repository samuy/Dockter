import React, { useState, useEffect } from 'react';
import LogsView from '../components/LogsView.tsx';
import Filter from '../components/Filter.tsx';

const LogsContainer = () => {
  const [sortBy, setSortBy] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    containerId: [],
    name: [],
    image: [],
    status: [],
    stream: [],
    timestamp: {
      from: '',
      to: '',
    },
    hostIp: [],
    hostPort: [],
    logLevel: [],
  });

  return (
    <div className="mx-8" data-tid="container">
      <Filter
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
      <LogsView filterOptions={filterOptions} />
    </div>
  );
};

export default LogsContainer;
