import * as React from 'react';
import { Item } from './PrincipalComponent';
import { ItemListComponent } from './ItemListComponent';

/*
 * MainContainer for the data.
 * That includes only the list of items.
 */

export const MainContainer: React.FC<{
  loading: boolean;
  items: Item[];
  setLevel(level: string, title: string): void;
}> = props => {
  return props.loading || props.items.length <= 0 ? (
    <p>Loading...</p>
  ) : (
    <>
      <h1>{props.items[0].text}</h1>
      <ItemListComponent
        items={props.items[0].children!!}
        setLevel={props.setLevel}
      />
    </>
  );
};
