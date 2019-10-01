import * as React from 'react';
import { Item } from './PrincipalComponent';
import { ItemComponent } from './ItemComponent';

/*
 * ItemListComponent
 * Shows the list of items
 */

export const ItemListComponent: React.FC<{
  items: Item[];
  setLevel(level: string, title: string): void;
}> = props => {
  const { items } = props;
  return (
    <ul className="itemsList">
      {items.map((i, idx) => (
        <ItemComponent key={`id_${idx}`} item={i} setLevel={props.setLevel} />
      ))}
    </ul>
  );
};
