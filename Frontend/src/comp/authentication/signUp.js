import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
const SignUp = () => {
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('User Name is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('https://localhost:7100/user/signup', {
        username: values.username,
        password: values.password,
      });
      console.log('Sign up successful:', values.username);
      toast.success('Sign up successful');
      navigate('/login');
    } catch (error) {
      toast.error('An error occurred during sign up');
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
            Create an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Formik
            initialValues={{
              username: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
          <Form className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 flex">
              User Name 
            </label>
            <div className="mt-2">
              <Field
                type="username"
                id="username"
                name="username"
                autoComplete="username"
                className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
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
              Sign up
            </button>
          </div>
        </Form>
          </Formik>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
