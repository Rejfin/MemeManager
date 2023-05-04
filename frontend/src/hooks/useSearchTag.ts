import { useState, useEffect } from 'react';
import { Tag } from '../models/tag.model';
import api from '../services/api';

const useSearchTag = (tagName: string) => {
  const [tagList, setTagList] = useState<Tag[]>([]);
  /**
   * debounced function to pull down tags from api and used them as prompt during input
   */
  useEffect(() => {
    setTimeout(() => {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      api.get(`/tags?name=${tagName}&limit=5`).then((data: any) => {
        setTagList(data.data.data.items);
      });
    }, 700);
  }, [tagName]);

  return { tagList };
};

export default useSearchTag;
