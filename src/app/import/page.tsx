import React from 'react';
import { Tabs, TabsTab, TabsList, TabsPanel } from '@mantine/core';
import Finam from './finam';
import Tinkoff from './tinkoff';
import Alfa from './alfa';
import Freedom from './freedom';

const tabsConfig = [
  { key: 'tinkoff', title: 'Tinkoff', content: <Tinkoff /> },
  { key: 'finam', title: 'Finam', content: <Finam /> },
  { key: 'alfa', title: 'Alfa', content: <Alfa /> },
  { key: 'freedom', title: 'Freedom', content: <Freedom /> },
];

const ImportPage: React.FC = () => {
  return (
    <Tabs defaultValue={tabsConfig[0].key}>
      <TabsList>
        {tabsConfig.map(item => (
          <TabsTab key={item.key} value={item.key}>
            {item.title}
          </TabsTab>
        ))}
      </TabsList>

      <br />

      {tabsConfig.map(item => (
        <TabsPanel key={item.key} value={item.key}>
          {item.content}
        </TabsPanel>
      ))}
    </Tabs>
  );
};

export default ImportPage;
