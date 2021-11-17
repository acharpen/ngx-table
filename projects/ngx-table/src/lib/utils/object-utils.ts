export class ObjectUtils {
  public static get(object: unknown, path: string): unknown {
    const fields = path.split('.');
    const len = fields.length;

    let index = 0;
    let value = object;

    while (value != null && index < len) {
      value = (value as Record<string, unknown>)[fields[index++]];
    }

    return index !== 0 && index === len ? value : null;
  }
}
