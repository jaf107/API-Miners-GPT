import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { LockClosedIcon, MailIcon } from '@heroicons/react/solid';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
const LogIn = () => {
  const history = useNavigate();
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('https://localhost:7100/user/login', {
        email: values.email,
        password: values.password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token); // Save token to localStorage
      toast.success('Login successful');
      history('/');
    } catch (error) {
      toast.error('Please check your email and password..!');
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 flex">
                  Email address
                </label>
                <div className="mt-2">
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </Form>
          </Formik>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LogIn;
