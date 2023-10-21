import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import useGlobalStore from "../store";

const BreadCrumb = () => {
  const [breadCrumbs, setBreadCrumbs] = useGlobalStore((state) => [
    state.breadCrumbs,
    state.setBreadCrumbs,
  ]);
  const navigate = useNavigate();

  const handleClick = (e, index) => {
    e.preventDefault();
    const href = breadCrumbs[index].href;
    setBreadCrumbs(breadCrumbs.slice(0, index + 1));
    navigate(href);
  };

  return (
    <>
      {breadCrumbs && breadCrumbs.length !== 0 ? (
        <Box sx={{ my: 3, ml: 4 }}>
          <Breadcrumbs separator="/">
            {breadCrumbs.map((bc, index) => {
              return (
                <Box
                  sx={{
                    py: 0.25,
                    px: 1,
                    border: "solid #eee 0.1rem",
                    borderRadius: 2,
                    bgcolor: "#f1f1f1",
                  }}
                >
                  {index === breadCrumbs.length - 1 ? (
                    <Typography color="text.primary" fontSize={20}>
                      {bc.name}
                    </Typography>
                  ) : (
                    <Link
                      fontSize={20}
                      underline="hover"
                      href={bc.href}
                      onClick={(e) => handleClick(e, index)}
                    >
                      {bc.name}
                    </Link>
                  )}
                </Box>
              );
            })}
          </Breadcrumbs>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

export default BreadCrumb;
