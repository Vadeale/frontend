import type { FormEvent } from 'react';
import type { JobCategory } from '../types';

interface JobFormProps {
  categories: { label: string; value: JobCategory }[];
  previewImage: string | null;
  onPreviewChange: (file: File | null) => void;
  onClearPreview: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function JobForm({ categories, previewImage, onPreviewChange, onClearPreview, onSubmit }: JobFormProps) {
  return (
    <div className="card">
      <form id="job-form" onSubmit={(event) => void onSubmit(event)}>
        <div className="form-group">
          <textarea
            name="text"
            id="job-description"
            maxLength={500}
            placeholder="Опишите тут свою задачу и укажите контакты (номер, ссылку, почту). После оплаты 10 ₽ она публикуется для всех фрилансеров в ленте заданий на 10 дней. Можно прикрепить фото до 1 МБ."
            required
          />
        </div>
        <div className="form-group">
          <select name="category" required defaultValue="">
            <option disabled value="">
              Выберите категорию
            </option>
            {categories
              .filter((item) => item.value !== 'all')
              .map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <input name="public_contacts" placeholder="Контакты для связи (телефон/TG/ссылка)" required type="text" />
        </div>
        <div className="form-group">
          <input name="employer_email" placeholder="Ваша почта (для чека)" required type="email" />
        </div>
        <div className="form-group">
          <input
            accept="image/*"
            id="image-upload"
            name="image"
            style={{ display: 'none' }}
            type="file"
            onChange={(event) => onPreviewChange(event.target.files?.[0] ?? null)}
          />
          <label className="file-upload" htmlFor="image-upload">
            Прикрепить изображение (необязательно)
          </label>
          <button type="button" id="clear-image" style={{ display: previewImage ? 'inline-block' : 'none' }} onClick={onClearPreview}>
            Удалить
          </button>
          <div className="image-preview" id="image-preview">
            {previewImage ? <img src={previewImage} alt="Предпросмотр изображения" /> : null}
          </div>
        </div>
        <div className="form-group consent-group">
          <label>
            <input type="checkbox" required /> Я согласен с <a href="/oferta/index.html" target="_blank" rel="noreferrer">офертой</a> и{' '}
            <a href="/privacy/index.html" target="_blank" rel="noreferrer">политикой конфиденциальности</a>
          </label>
        </div>
        <button className="btn" type="submit">
          Разместить за 10 ₽
        </button>
      </form>
    </div>
  );
}
