import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Item } from './PrincipalComponent';

/*
 * ItemComponent
 * This includes only the data for a single item
 */

export const ItemComponent: React.FC<{
  item: Item;
  setLevel(level: string, title: string): void;
}> = props => {
  const db = firebase.firestore();
  const { item } = props;
  const [isCheked, setIsChecked] = React.useState(item.isDone);

  const onChangeCheck = (e: any) => {
    const value = e.target.checked;
    db.collection('items')
      .doc(item.id!!)
      .set({ isDone: value }, { merge: true })
      .then(() => {
        setIsChecked(value);
      });
  };

  React.useEffect(() => {
    setIsChecked(props.item.isDone);
  }, [props.item]);

  return (
    <li className="item" key={item.id}>
      <input type="checkbox" checked={isCheked} onChange={onChangeCheck} />
      <p onClick={() => props.setLevel(item.id!!, item.text)}>{item.text}</p>
    </li>
  );
};
