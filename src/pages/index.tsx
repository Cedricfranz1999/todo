/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React from "react";
import { Button, Form, Input } from "antd";
import { api } from "~/utils/api";
import { Modal } from "antd";

type FieldType = {
  name?: string;
  lastname?: string;
};

interface Props {
  onSubmit: (values: FieldType) => void;
}

const MyForm: React.FC<Props> = ({ onSubmit }) => (
  <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onSubmit}
    autoComplete="off"
  >
    <Form.Item<FieldType>
      label="Name"
      name="name"
      rules={[{ required: true, message: "Please input your name!" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<FieldType>
      label="LastName"
      name="lastname"
      rules={[{ required: true, message: "Please input your lastname!" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);

const App: React.FC = () => {
  const { data, isLoading, refetch } = api.name.getAll.useQuery();
  const {
    data: dataProfile,
    isLoading: loadingProfile,
    refetch: refetchProfile,
  } = api.profile.getAll.useQuery();

  console.log("PRRRROOOOOFFFFFFIIIIIILEEEEEEEEEE", dataProfile);

  const saveMutation = api.name.save.useMutation();
  const deleteMutation = api.name.delete.useMutation();
  const updateMutation = api.name.update.useMutation();

  const handleSubmit = async (values: FieldType) => {
    console.log("Submitting:", values);

    // Ensure that values.name and values.lastname are not undefined
    const firstname = values.name ?? "";
    const lastname = values.lastname ?? "";

    // Call the save mutation to save the data to the database
    const result = await saveMutation.mutateAsync({
      firstname: firstname,
      lastname: lastname,
    });

    if (result) {
      console.log("Data saved successfully!");
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    // Call the delete mutation to remove the data from the database
    const deleteResult = await deleteMutation.mutateAsync(id);

    if (deleteResult) {
      deleteMutation.reset(); // Reset the mutation cache
      refetch();
      console.log("Data deleted successfully!");
    }
  };

  const handleUpdate = async (id: string, updatedValues: FieldType) => {
    const transformedValues = {
      firstname: updatedValues.name ?? "", // Transform 'name' to 'firstname'
      lastname: updatedValues.lastname ?? "",
    };

    const result = await updateMutation.mutateAsync({
      id,
      ...transformedValues,
    });

    if (result) {
      updateMutation.reset();
      refetch();
      console.log("Data updated successfully!");
    }
  };

  return (
    <div>
      <MyForm onSubmit={handleSubmit} />

      <div>
        <h2>Submitted Data:</h2>
        <ul>
          {data?.map((data, index) => (
            <li key={index}>
              Name: {data.firstname}, LastName: {data.lastname}
              {data.id}
              <button
                className="ml-5 bg-red-400"
                onClick={() => handleDelete(data.id)} // Call handleDelete with the data's ID
              >
                Delete
              </button>
              <button
                className=" ml-5 bg-yellow-400 "
                onClick={() => {
                  const newFirstName =
                    prompt("Enter new first name:") ?? data.firstname;
                  const newLastName =
                    prompt("Enter new last name:") ?? data.lastname;
                  handleUpdate(data.id, {
                    name: newFirstName,
                    lastname: newLastName,
                  });
                }}
              >
                {" "}
                Update
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
