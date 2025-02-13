import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createAd, updateAd, getAdById } from '../services/api';
import { Ad, RealEstateAd, AutoAd, ServicesAd, initialRealEstateAd } from '../types/Ad';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import AuthPopup from './popups/AuthPopup';
import { checkIfLoggedIn } from '../services/auth';
import AdFormSteps from './AdFormSteps';

const AdForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Ad | RealEstateAd | AutoAd | ServicesAd>(initialRealEstateAd);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await checkIfLoggedIn();
      setIsLoggedIn(loggedIn);
      setAuthPopupOpen(!loggedIn);
      if (loggedIn) {
        const draftData = localStorage.getItem('adFormDraft');
        if (draftData) {
          setFormData(JSON.parse(draftData));
          setHasDraft(true);
        }
      }
      setLoading(false);
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (id && isLoggedIn) {
      getAdById(id)
        .then((ad) => {
          setFormData(ad);
          setErrors({});
          localStorage.removeItem('adFormDraft');
        })
        .catch(() => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            fetch: 'Ошибка загрузки объявления',
          }));
        });
    }
  }, [id, isLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setAuthPopupOpen(false);
    window.location.reload(); // Refresh the page to update the header
  };

  const handleSaveDraft = () => {
    localStorage.setItem('adFormDraft', JSON.stringify(formData));
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem('adFormDraft');
    setFormData(initialRealEstateAd);
    setHasDraft(false);
  };

  if (loading) {
    return <div className="text-center p-4">Загрузка...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="p-4 bg-white shadow-md rounded-md max-w-2xl mx-auto mt-15 text-center">
        <p className="text-red-500">Вы должны войти в систему, чтобы просматривать содержимое</p>
        {authPopupOpen && (
          <AuthPopup onClose={() => setAuthPopupOpen(false)} view="login" onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    );
  }

  if (hasDraft) {
    return (
      <div className="p-4 bg-white shadow-md rounded-md max-w-2xl mx-auto mt-15 text-center">
        <p className="text-gray-700">У вас есть черновик формы. Хотите продолжить заполнение или начать новую форму?</p>
        <div className="mt-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2" onClick={() => setHasDraft(false)}>
            Продолжить
          </button>
          <button className="bg-red-500 text-white py-2 px-4 rounded-md" onClick={handleDiscardDraft}>
            Начать заново
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userId: 'Пользователь не авторизован',
      }));
      return;
    }

    const adData = { ...formData, userId };

    if (id) {
      updateAd(id, adData)
        .then(() => {
          localStorage.removeItem('adFormDraft');
          navigate(`/form/${id}`); // Redirect to the same page of the item ad
        })
        .catch(() => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            submit: 'Ошибка обновления объявления',
          }));
        });
    } else {
      createAd(adData)
        .then(() => {
          localStorage.removeItem('adFormDraft');
          navigate('/list');
        })
        .catch(() => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            submit: 'Ошибка создания объявления',
          }));
        });
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md max-w-2xl mx-auto mt-15">
      <nav className="flex items-center space-x-2 text-gray-700 mb-4">
        <Link to="/" className="hover:underline">Главная</Link>
        <ChevronRightIcon className="w-5 h-5" />
        <Link to="/list" className="hover:underline">Объявления</Link>
        <ChevronRightIcon className="w-5 h-5" />
        <Link to={id ? `/form/${id}` : '/form'} className="hover:underline">{id ? 'Редактировать объявление' : 'Создать объявление'}</Link>
        <ChevronRightIcon className="w-5 h-5" />
        {step === 1 ? (
          <span>Шаг 1</span>
        ) : (
          <Link to="#" onClick={() => setStep(1)} className="hover:underline">Шаг 1</Link>
        )}
        {step === 2 && (
          <>
            <ChevronRightIcon className="w-5 h-5" />
            <span>Шаг 2</span>
          </>
        )}
      </nav>
      <h2 className="text-2xl font-bold mb-4">{id ? 'Редактировать объявление' : 'Создать объявление'}</h2>
      <form onSubmit={handleSubmit}>
        <AdFormSteps
          step={step}
          setStep={setStep}
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          handleSaveDraft={handleSaveDraft}
        />
      </form>
    </div>
  );
};

export default AdForm;