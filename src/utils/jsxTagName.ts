import { ELEMENT_TAG_NAME_MAPPING } from '../constants/mappings';

/**
 * Convert tag name to tag name suitable for JSX.
 *
 * @param  tagName  String of tag name
 * @return
 */
export default function jsxTagName(tagName: string) {
  var name = tagName.toLowerCase();

  if (ELEMENT_TAG_NAME_MAPPING.hasOwnProperty(name)) {
    name =
      ELEMENT_TAG_NAME_MAPPING[name as keyof typeof ELEMENT_TAG_NAME_MAPPING];
  }

  return name;
}
