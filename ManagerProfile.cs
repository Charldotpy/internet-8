<?xml version="1.0" encoding="utf-8"?>
<Project ToolsVersion="15.0" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <Import Project="$(MSBuildExtensionsPath)\$(MSBuildToolsVersion)\Microsoft.Common.props" Condition="Exists('$(MSBuildExtensionsPath)\$(MSBuildToolsVersion)\Microsoft.Common.props')" />
  <PropertyGroup>
    <Configuration Condition=" '$(Configuration)' == '' ">Debug</Configuration>
    <Platform Condition=" '$(Platform)' == '' ">AnyCPU</Platform>
    <ProjectGuid>{FE997A67-5366-415F-9A49-A4EDBCA02150}</ProjectGuid>
    <OutputType>WinExe</OutputType>
    <RootNamespace>Group_C_IOOP_Assignment</RootNamespace>
    <AssemblyName>Group C IOOP Assignment</AssemblyName>
    <TargetFrameworkVersion>v4.7.2</TargetFrameworkVersion>
    <FileAlignment>512</FileAlignment>
    <AutoGenerateBindingRedirects>true</AutoGenerateBindingRedirects>
    <Deterministic>true</Deterministic>
  </PropertyGroup>
  <PropertyGroup Condition=" '$(Configuration)|$(Platform)' == 'Debug|AnyCPU' ">
    <PlatformTarget>AnyCPU</PlatformTarget>
    <DebugSymbols>true</DebugSymbols>
    <DebugType>full</DebugType>
    <Optimize>false</Optimize>
    <OutputPath>bin\Debug\</OutputPath>
    <DefineConstants>DEBUG;TRACE</DefineConstants>
    <ErrorReport>prompt</ErrorReport>
    <WarningLevel>4</WarningLevel>
  </PropertyGroup>
  <PropertyGroup Condition=" '$(Configuration)|$(Platform)' == 'Release|AnyCPU' ">
    <PlatformTarget>AnyCPU</PlatformTarget>
    <DebugType>pdbonly</DebugType>
    <Optimize>true</Optimize>
    <OutputPath>bin\Release\</OutputPath>
    <DefineConstants>TRACE</DefineConstants>
    <ErrorReport>prompt</ErrorReport>
    <WarningLevel>4</WarningLevel>
  </PropertyGroup>
  <ItemGroup>
    <Reference Include="System" />
    <Reference Include="System.Core" />
    <Reference Include="System.Xml.Linq" />
    <Reference Include="System.Data.DataSetExtensions" />
    <Reference Include="Microsoft.CSharp" />
    <Reference Include="System.Data" />
    <Reference Include="System.Deployment" />
    <Reference Include="System.Drawing" />
    <Reference Include="System.Net.Http" />
    <Reference Include="System.Windows.Forms" />
    <Reference Include="System.Xml" />
  </ItemGroup>
  <ItemGroup>
    <Compile Include="LoginPage.cs">
      <SubType>Form</SubType>
    </Compile>
    <Compile Include="LoginPage.Designer.cs">
      <DependentUpon>LoginPage.cs</DependentUpon>
    </Compile>
    <Compile Include="Manager\ManagerHomePage.cs">
      <SubType>Form</SubType>
    </Compile>
    <Compile Include="Manager\ManagerHomePage.Designer.cs">
      <DependentUpon>ManagerHomePage.cs</DependentUpon>
    </Compile>
    <Compile Include="Manager\ManagerProfile.cs">
      <SubType>Form</SubType>
    </Compile>
    <Compile Include="Manager\ManagerProfile.Designer.cs">
      <DependentUpon>ManagerProfile.cs</DependentUpon>
    </Compile>
    <Compile Include="Manager\ManagerRefund.cs">
      <SubType>Form</SubType>
    </Compile>
    <Compile Include="Manager\ManagerRefund.Designer.cs">
      <DependentUpon>ManagerRefund.cs</DependentUpon>
    </Compile>
    <Compile Include="Manager\ManagerTopUp.cs">
      <SubType>Form</SubType>
    </Compile>
    <Compile Include="Manager\ManagerTopUp.Designer.cs">
      <DependentUpon>ManagerTopUp.cs</DependentUpon>
    </Compile>
    <Compile Include="Manager\ManagerTopUpUsername.cs">
      <SubType>Form</SubType>
    </Compile>
    <Compile Include="Manager\ManagerTopUpUsername.Designer.cs">
      <DependentUpon>ManagerTopUpUsername.cs</DependentUpon>
    </Compile>
    <Compile Include="Manager\ManagerUsername.cs" />
    <Compile Include="Manager\ManagerViewFeedback.cs">
      <SubType>Form</SubType>
    </Compile>
    <Compile Include="Manager\ManagerViewFeedback.Designer.cs">
      <DependentUpon>ManagerViewFeedback.cs</DependentUpon>
    </Compile>
    <Compile Include="Manager\RefundManager.cs" />
    <Compile Include="Manager\TopUpManager.cs" />
    <Compile Include="Program.cs" />
    <Compile Include="Properties\AssemblyInfo.cs" />
    <EmbeddedResource Include="LoginPage.resx">
      <DependentUpon>LoginPage.cs</DependentUpon>
    </EmbeddedResource>
    <EmbeddedResource Include="Manager\ManagerHomePage.resx">
      <DependentUpon>ManagerHomePage.cs</DependentUpon>
    </EmbeddedResource>
    <EmbeddedResource Include="Manager\ManagerProfile.resx">
      <DependentUpon>ManagerProfile.cs</DependentUpon>
    </EmbeddedResource>
    <EmbeddedResource Include="Manager\ManagerRefund.resx">
      <DependentUpon>ManagerRefund.cs</DependentUpon>
    </EmbeddedResource>
    <EmbeddedResource Include="Manager\ManagerTopUp.resx">
      <DependentUpon>ManagerTopUp.cs</DependentUpon>
    </EmbeddedResource>
    <EmbeddedResource Include="Manager\ManagerTopUpUsername.resx">
      <DependentUpon>ManagerTopUpUsername.cs</DependentUpon>
    </EmbeddedResource>
    <EmbeddedResource Include="Manager\ManagerViewFeedback.resx">
      <DependentUpon>ManagerViewFeedback.cs</DependentUpon>
    </EmbeddedResource>
    <EmbeddedResource Include="Properties\Resources.resx">
      <Generator>ResXFileCodeGenerator</Generator>
      <LastGenOutput>Resources.Designer.cs</LastGenOutput>
      <SubType>Designer</SubType>
    </EmbeddedResource>
    <Compile Include="Properties\Resources.Designer.cs">
      <AutoGen>True</AutoGen>
      <DependentUpon>Resources.resx</DependentUpon>
      <DesignTime>True</DesignTime>
    </Compile>
    <None Include="Properties\Settings.settings">
      <Generator>SettingsSingleFileGenerator</Generator>
      <LastGenOutput>Settings.Designer.cs</LastGenOutput>
    </None>
    <Compile Include="Properties\Settings.Designer.cs">
      <AutoGen>True</AutoGen>
      <DependentUpon>Settings.settings</DependentUpon>
      <DesignTimeSharedInput>True</DesignTimeSharedInput>
    </Compile>
  </ItemGroup>
  <ItemGroup>
    <None Include="App.config" />
  </ItemGroup>
  <ItemGroup>
    <Folder Include="Chef\" />
    <Folder Include="Customer\" />
    <Folder Include="System Admin\" />
  </ItemGroup>
  <ItemGroup>
    <None Include="Resources\image1.jpg" />
  </ItemGroup>
  <ItemGroup>
    <None Include="Resources\image1.png" />
  </ItemGroup>
  <ItemGroup>
    <None Include="Resources\image2.png" />
  </ItemGroup>
  <ItemGroup>
    <None Include="Resources\image3.png" />
  </ItemGroup>
  <ItemGroup>
    <None Include="Resources\image4.png" />
  </ItemGroup>
  <ItemGroup>
    <None Include="Resources\image5.png" />
  </ItemGroup>
  <ItemGroup>
    <None Include="Resources\image6.png" />
  </ItemGroup>
  <ItemGroup>
    <None Include="Resources\image7.png" />
  </ItemGroup>
  <ItemGroup>
    <None Include="Resources\image8.png" />
  </ItemGroup>
  <Import Project="$(MSBuildToolsPath)\Microsoft.CSharp.targets" />
</Project>